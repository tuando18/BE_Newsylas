const UserService = require("../../services/userService");
const HttpResponse = require("../../utils/httpResponse");

class UserController {
  login = async (req, res) => {
    const { username, password } = req.body;
    try {
      const data = await new UserService().login(username, password);
      if (data && data.status === 200) {     
          req.session.admin = data;
          return res.json(HttpResponse.resultAuth(data));
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
    const userId = req.session.admin.id;

    try {
      const data = await new UserService().updateWalletInfo(userId, publicKey, solanaTokenBalance);
      if (data && data.status === 200) {
          return res.json(HttpResponse.success({ message: 'Wallet info saved successfully' }));
      } else {
          return res.json(HttpResponse.fail({ message: 'Failed to save wallet info' }));
      }
    } catch (error) {
      console.log(error);
      return res.json(HttpResponse.error(error));
    }
  };
}

module.exports = UserController;
