const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  point: { type: Number, default: 0 }  // Thêm thuộc tính point, mặc định là 0
});
// // Hash the password before saving
// userSchema.pre('save', async function (next) {
//     if (this.isModified('password')) {
//         this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
// });

// userSchema.methods.comparePassword = function (password) {
//     return bcrypt.compare(password, this.password);
// };

module.exports = mongoose.model('user', userSchema);
