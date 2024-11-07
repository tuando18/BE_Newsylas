const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const UserService = require("../../services/userService");
const HttpResponse = require("../../utils/httpResponse");

class UserController {
  login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const data = await new UserService().login(username, password);

        if (data && data.status === 200) {     
            console.log(data);
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
}

module.exports = UserController;

