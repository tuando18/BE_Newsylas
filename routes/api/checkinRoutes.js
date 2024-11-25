const express = require('express');
const router = express.Router();
const checkinController = require('../../controllers/api/checkinController'); // Đường dẫn tới controller

// Endpoint điểm danh
router.post('/checkin', checkinController.checkInUser);

// Endpoint lấy trạng thái điểm danh
router.get('/checkin/:userId', checkinController.getCheckinStatus);
module.exports = router;
