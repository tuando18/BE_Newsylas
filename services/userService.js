const Users = require("../models/userModel");
const JWT = require('jsonwebtoken');
const HttpResponse = require("../utils/httpResponse");
const dotenv = require('dotenv');
dotenv.config();
const SECRETKEY = process.env.SECRETKEY;

class UserService {
  // Đăng ký người dùng
  register = async (username, password, role = 'user') => {
    try {
      const existingUser = await Users.findOne({ username });
      if (existingUser) {
        return HttpResponse.fail({ message: 'Tên người dùng đã tồn tại' });
      }

      const newUser = await Users.create({ username, password, role });
      const token = JWT.sign({ id: newUser._id, role: newUser.role }, SECRETKEY, { expiresIn: '1h' });
      const refreshToken = JWT.sign({ id: newUser._id, role: newUser.role }, SECRETKEY, { expiresIn: '1d' });

      return HttpResponse.auth(newUser, token, refreshToken);
    } catch (error) {
      console.log(error);
      return HttpResponse.error(error);
    }
  };

  // Đăng nhập người dùng
  login = async (username, password) => {
    try {
      const user = await Users.findOne({ username, password });
      if (user) {
        const token = JWT.sign({ id: user._id, role: user.role }, SECRETKEY, { expiresIn: '1h' });
        const refreshToken = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: '1d' });

        return HttpResponse.auth(user, token, refreshToken);
      } else {
        return HttpResponse.fail(HttpResponse.getErrorMessages('loginFail'));
      }
    } catch (error) {
      console.log(error);
      return HttpResponse.error(error);
    }
  };

  // Thêm điểm cho người dùng
  addPoints = async (userId, points = 5) => {
    try {
      const user = await Users.findById(userId);
      if (!user) {
        return HttpResponse.fail('User not found');
      }

      // Cộng điểm cho người dùng
      user.point += points;
      await user.save();

      return HttpResponse.success({ message: `Points added successfully. New point total: ${user.point}` });
    } catch (error) {
      console.log(error);
      return HttpResponse.error(error);
    }
  };
  // Hàm để lấy tất cả người dùng
  getAllUsers = async () => {
    try {
      const users = await Users.find({}, { password: 0 }); // Không lấy trường password vì bảo mật
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
    
  };
  getUserById = async (userId) => {
    try {
      const user = await Users.findById(userId, { password: 0 }); // Không lấy trường password để bảo mật
      if (!user) {
        return HttpResponse.fail('User not found');
      }
      return HttpResponse.success(user);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return HttpResponse.error(error);
    }
  };

}

module.exports = UserService;
