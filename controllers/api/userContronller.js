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

  // Thêm endpoint để lưu thông tin ví Solana
  saveWallet = async (req, res) => {
    const { publicKey, solanaTokenBalance } = req.body;
  
    // Kiểm tra session admin
    console.log("Session Admin (Before Update):", req.session.admin);
  
    if (!req.session.admin) {
      return res.status(401).json({ message: 'Unauthorized, please login.' });
    }
  
    const userId = req.session.admin._id;  // Sử dụng _id thay vì id
    console.log("User ID from Session:", userId);
  
    try {
      const data = await new UserService().updateWalletInfo(userId, publicKey, solanaTokenBalance);
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
