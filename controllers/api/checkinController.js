const checkinService = require('../../services/checkinService');

const checkInUser = async (req, res) => {
    const { userId } = req.body;

    try {
        const checkin = await checkinService.checkInUser(userId);
        res.status(200).json({ message: 'Điểm danh thành công!', checkin });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getCheckinStatus = async (req, res) => {
    const { userId } = req.params;

    try {
        const checkin = await checkinService.getCheckinStatus(userId);
        res.status(200).json(checkin);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = {
    checkInUser,
    getCheckinStatus,
};
