const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checkinSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    checkedDays: { type: [String], default: [] }, // Lưu tên ngày thay vì số (VD: "Chủ nhật", "Thứ hai", ...)
    week: { type: Number, required: true }, // Tuần hiện tại
    year: { type: Number, required: true }, // Năm hiện tại
}, { timestamps: true });

module.exports = mongoose.model('Checkin', checkinSchema);
