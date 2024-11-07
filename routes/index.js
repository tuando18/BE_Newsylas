var express = require('express');
const managerRouter = require('./managerRoutes');
var router = express.Router();
const { isAuthenticated, redirectToHomeIfLoggedIn, isAuthorized } = require('../middlewares/authMiddleware');

/* GET home page. */

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.use([ '/post', '/user', '/create_post','/token'], isAuthenticated);
router.get('/',isAuthenticated);
router.use("/", managerRouter);
// router.get('/dashboard', function(req, res, next) {
//   res.render('dashboard', { title: 'Dashboard' });
// });
module.exports = router;
