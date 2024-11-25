var express = require('express');
var router = express.Router();
const UserController = require('../../controllers/api/userContronller');

/* GET home page. */
// router.get('/login', function(req, res) {
//     console.log(111111);
//     res.send(2004);
// });
router.get('/get-all-user', new UserController().getAllUsers); 
router.post('/login', new UserController().login);
router.post('/register', new UserController().register);
router.put('/:userId/add-points', new UserController().addPoints);
router.put('/:userId/add-points-checkin', new UserController().addPointsCheckin);
router.get('/get-user-by-id/:userId', new UserController().getUserById); 
router.post('/save-wallet', new UserController().saveWallet);

module.exports = router;
