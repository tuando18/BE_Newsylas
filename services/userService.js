const Users = require("../models/userModel");
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const HttpResponse = require("../utils/httpResponse");
const UtilsFunctions = require("../utils/utilsFunction");
const dotenv = require('dotenv');
dotenv.config();
const SECRETKEY = process.env.SECRETKEY

class UserService {
    register = async (username, password, role = 'user') => {
        try {
            const existingUser = await Users.findOne({ username });
            if (existingUser) {
                return HttpResponse.fail({ message: 'Username already exists' });
            }
    
            // Lưu mật khẩu dạng văn bản thuần túy
            const newUser = await Users.create({ username, password, role });
    
            const token = JWT.sign({ id: newUser._id, role: newUser.role }, SECRETKEY, { expiresIn: '1h' });
            const refreshToken = JWT.sign({ id: newUser._id, role: newUser.role }, SECRETKEY, { expiresIn: '1d' });
    
            return HttpResponse.auth(newUser, token, refreshToken);
        } catch (error) {
            console.log(error);
            return HttpResponse.error(error);
        }
    };
    
    login = async (username, password) => {
        try {
            // Tìm người dùng và kiểm tra trực tiếp mật khẩu thô
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
    
}

module.exports = UserService;