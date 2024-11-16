const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  publicKey: { type: String, default: null },  // Lưu publicKey của ví Solana
  point: { type: Number, default: 0 }         // Số điểm của người dùng
});

module.exports = mongoose.model('Users', userSchema);
