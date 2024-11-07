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

    updateWalletInfo = async (userId, publicKey, solanaTokenBalance) => {
        console.log("Updating wallet for user:", userId);
        console.log("Public Key:", publicKey);
        console.log("Solana Balance:", solanaTokenBalance);
      
        try {
          const updatedUser = await Users.findByIdAndUpdate(
            userId,
            { publicKey, solanaTokenBalance },
            { new: true }  // Trả về tài liệu đã cập nhật
          );
          if (updatedUser) {
            console.log("Updated user:", updatedUser);
            return HttpResponse.success(updatedUser);
          } else {
            return HttpResponse.fail({ message: 'User not found' });
          }
        } catch (error) {
          console.log("Error in updating wallet:", error);
          return HttpResponse.error(error);
        }
      };
      
    
}

module.exports = UserService;
