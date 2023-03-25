const express = require('express');
const RG = require('../utils/response-generator');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
	return RG.respondSuccess(res)('Server test', { message: 'Express server running successfully' });
});

module.exports = router;
