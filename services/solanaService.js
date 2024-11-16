require('dotenv').config(); // Load environment variables from .env

const { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, Transaction, SystemProgram } = require('@solana/web3.js');

// Tỷ lệ chuyển đổi: 100 điểm = 0.0001 SOL
const POINTS_TO_SOL_RATE = 0.0001;

// Kết nối Solana - Sử dụng URL từ biến môi trường
const connection = new Connection(process.env.SOLANA_CONNECTION_URL);

// Ví quản trị (Admin wallet) - lấy từ biến môi trường
const ADMIN_SECRET_KEY = Uint8Array.from(process.env.ADMIN_SECRET_KEY.split(',').map(Number));
const adminWallet = Keypair.fromSecretKey(ADMIN_SECRET_KEY);

async function convertPointsToSol(userWalletAddress, points) {
    try {
        // Tính toán số SOL tương ứng
        const solAmount = points * POINTS_TO_SOL_RATE;

        // Chuyển đổi SOL sang lamports
        const lamports = solAmount * LAMPORTS_PER_SOL;

        if (lamports < 1) {
            throw new Error("Conversion amount is too small.");
        }

        // Tạo giao dịch chuyển SOL
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: adminWallet.publicKey,
                toPubkey: new PublicKey(userWalletAddress),
                lamports: Math.floor(lamports),
            })
        );

        // Ký và gửi giao dịch
        const signature = await connection.sendTransaction(transaction, [adminWallet]);
        console.log("Transaction signature:", signature);

        return {
            success: true,
            signature,
            solAmount,
        };
    } catch (error) {
        console.error("Error converting points to SOL:", error.message);
        return {
            success: false,
            error: error.message,
        };
    }
}

module.exports = { convertPointsToSol };
