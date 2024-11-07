const express = require('express');
const tokenController  = require('../../controllers/api/tokenController');

const router = express.Router();

router.get('/token', tokenController.getTokenInfo); // Route để lấy thông tin token
// router.post('/transfer', tokenController.transferTokens); // Route để lấy thông tin token

module.exports = router;
