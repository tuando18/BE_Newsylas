var express = require('express');
var router = express.Router();
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');

/* GET home page. */
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/posts', postRoutes);

module.exports = router;
