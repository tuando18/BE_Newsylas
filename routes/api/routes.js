var express = require('express');
var router = express.Router();

const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const tokenRoutes = require('./tokenRoutes');

/* GET home page. */
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/posts', postRoutes);
router.use('/api/v1/tokens', tokenRoutes);

module.exports = router;
