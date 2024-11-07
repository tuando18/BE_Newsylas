var express = require('express');
var router = express.Router();
const UserController = require('../../controllers/api/userContronller');

/* GET home page. */
// router.get('/login', function(req, res) {
//     console.log(111111);
//     res.send(2004);
// });
router.post('/login', new UserController().login);
router.post('/register', new UserController().register);

module.exports = router;
