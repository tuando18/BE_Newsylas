const UserService = require("../../services/userService");
const HttpResponse = require("../../utils/httpResponse");

class UserController {
  login = async (req, res) => {
    const { username, password } = req.body;
    try {
      const data = await new UserService().login(username, password);
      if (data && data.status === 200) {
        req.session.admin = data.data;  // Lưu đúng thông tin vào session
        req.session.save((err) => {
          if (err) {
            console.error('Error saving session:', err);
            return res.status(500).json({ message: 'Session save failed' });
          }
          return res.json(HttpResponse.resultAuth(data));
        });
      } else {
        return res.json(HttpResponse.fail(HttpResponse.getErrorMessages('loginFail')));
      }
    } catch (error) {
      console.log(error);
      return res.json(HttpResponse.error(error));
    }
  };


  register = async (req, res) => {
    const { username, password } = req.body;
    try {
      const data = await new UserService().register(username, password);
      if (data && data.status === 200) {
        return res.json(HttpResponse.resultAuth(data));
      } else {
        return res.json(HttpResponse.fail(HttpResponse.getErrorMessages('registerFail')));
      }
    } catch (error) {
      console.log(error);
      return res.json(HttpResponse.error(error));
    }
  };

  // Cộng điểm cho người dùng
  addPoints = async (req, res) => {
    const { userId } = req.params;
    try {
      const data = await new UserService().addPoints(userId);
      if (data && data.status === 200) {
        return res.json(HttpResponse.success(data));
      } else {
        return res.status(404).json(HttpResponse.fail('Failed to add points.'));
      }
    } catch (error) {
      console.log(error);
      return res.json(HttpResponse.error(error));
    }
  };

  addPointsCheckin = async (req, res) => {
    const { userId } = req.params;
    try {
      const data = await new UserService().addPointsCheckin(userId);
      if (data && data.status === 200) {
        return res.json(HttpResponse.success(data));
      } else {
        return res.status(404).json(HttpResponse.fail('Failed to add points.'));
      }
    } catch (error) {
      console.log(error);
      return res.json(HttpResponse.error(error));
    }
  };
  
  // Hàm để lấy tất cả người dùng
  getAllUsers = async (req, res) => {
    try {
      const users = await new UserService().getAllUsers();
      return res.json(HttpResponse.success(users));
    } catch (error) {
      console.log(error);
      return res.status(500).json(HttpResponse.error('Failed to fetch users'));
    }
  };

  getUserById = async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await new UserService().getUserById(userId);
      if (user && user.status === 200) {
        return res.json(user);
      } else {
        return res.status(404).json(HttpResponse.fail('User not found'));
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json(HttpResponse.error('Failed to fetch user by ID'));
    }
  };
  saveWallet = async (req, res) => {
    const { publicKey } = req.body;
  
    // Kiểm tra session admin
    console.log("Session Admin (Before Update):", req.session.admin);
  
    if (!req.session.admin) {
      return res.status(401).json({ message: 'Unauthorized, please login.' });
    }
  
    const userId = req.session.admin._id;  // Sử dụng _id thay vì id
    console.log("User ID from Session:", userId);
  
    try {
      const data = await new UserService().updateWalletInfo(userId, publicKey);
      if (data && data.status === 200) {
        return res.json(HttpResponse.success({ message: 'Wallet info saved successfully' }));
      } else {
        return res.json(HttpResponse.fail({ message: 'Failed to save wallet info' }));
      }
    } catch (error) {
      console.log("Error saving wallet info:", error);
      return res.json(HttpResponse.error(error));
    }
  };
}

module.exports = UserController;
