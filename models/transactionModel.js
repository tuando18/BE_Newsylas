const mongoose = require('mongoose');

// Định nghĩa schema cho giao dịch
const transactionSchema = new mongoose.Schema({
    userId: String,
    points: Number,
    solAmount: Number,
    signature: String,
    timestamp: { type: Date, default: Date.now },
});

// Tạo model cho giao dịch
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = { Transaction };
