var express = require('express');
const managerRouter = require('./managerRoutes');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
router.use('/', managerRouter);


module.exports = router;
