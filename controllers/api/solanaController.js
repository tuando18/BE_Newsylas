const { convertPointsToSol } = require('../../services/solanaService');
const { Transaction } = require('../../models/transactionModel');
const Users = require('../../models/userModel');

const handleConvertPointsToSol = async (req, res) => {
    try {
        // Lấy userId từ session hoặc JWT
        const userId = req.session?.admin?._id; // Hoặc từ JWT
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized, please login." });
        }

        // Lấy thông tin người dùng từ database
        const user = await Users.findById(userId);
        if (!user || !user.publicKey) {
            return res.status(404).json({ message: "User wallet not connected." });
        }

        const { point: userPoints, publicKey: userWalletAddress } = user;
        const { points } = req.body;

        if (points > userPoints) {
            return res.status(400).json({ message: "Insufficient points." });
        }

        // Chuyển đổi điểm sang SOL
        const result = await convertPointsToSol(userWalletAddress, points);
        if (result.success) {
            // Lưu giao dịch vào database MongoDB
            const newTransaction = new Transaction({
                userId: userId,
                points: points,
                solAmount: result.solAmount,
                signature: result.signature,
            });

            await newTransaction.save();

            // Cập nhật điểm người dùng
            user.point -= points;
            await user.save();

            return res.status(200).json({
                message: "Conversion successful",
                signature: result.signature,
                solAmount: result.solAmount,
            });
        } else {
            return res.status(400).json({ message: result.error });
        }
    } catch (error) {
        console.error("Error in handleConvertPointsToSol:", error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
};


module.exports = { handleConvertPointsToSol };
