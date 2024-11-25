var express = require('express');
var router = express.Router();

const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const tokenRoutes = require('./solanaRoutes');
const checkinRoutes = require('./checkinRoutes');

/* GET home page. */
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/posts', postRoutes);
router.use('/api/v1/tokens', tokenRoutes);
router.use('/api/v1/checkins', checkinRoutes);

module.exports = router;
