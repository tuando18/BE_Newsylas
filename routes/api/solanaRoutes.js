const express = require('express');
const { handleConvertPointsToSol } = require('../../controllers/api/solanaController');

const router = express.Router();

router.post('/convert', handleConvertPointsToSol);

module.exports = router;
