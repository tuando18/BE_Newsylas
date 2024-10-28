var express = require('express');
var router = express.Router();
const userRoutes = require('./userRoutes');

/* GET home page. */
router.use('/api/v1/users', userRoutes);

module.exports = router;
