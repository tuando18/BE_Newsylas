const moment = require('moment');
const Checkin = require('../models/checkinModel');

// Mảng tên ngày trong tuần
const daysOfWeek = ["CN", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];

const checkInUser = async (userId) => {
    const currentDayIndex = moment().day(); // 0 = Chủ nhật, 1 = Thứ hai, ...
    const currentDayName = daysOfWeek[currentDayIndex]; // Lấy tên ngày từ mảng
    const currentWeek = moment().isoWeek();
    const currentYear = moment().year();

    let checkin = await Checkin.findOne({ userId, week: currentWeek, year: currentYear });

    if (!checkin) {
        // Nếu chưa có dữ liệu điểm danh, tạo mới
        checkin = new Checkin({
            userId,
            week: currentWeek,
            year: currentYear,
            checkedDays: [currentDayName], // Lưu tên ngày
        });
    } else if (checkin.checkedDays.includes(currentDayName)) {
        throw new Error('Bạn đã điểm danh ngày hôm nay!');
    } else {
        // Thêm ngày hiện tại vào danh sách điểm danh
        checkin.checkedDays.push(currentDayName);
    }

    await checkin.save();
    return checkin;
};

// Lấy dữ liệu điểm danh của user
const getCheckinStatus = async (userId) => {
    const currentWeek = moment().isoWeek();
    const currentYear = moment().year();

    // Tìm dữ liệu điểm danh của người dùng trong tuần và năm hiện tại
    const checkin = await Checkin.findOne({ userId, week: currentWeek, year: currentYear });
    if (!checkin) {
        throw new Error('Bạn chưa điểm danh tuần này.');
    }

    return checkin;
};


module.exports = {
    checkInUser,
    getCheckinStatus,
};
