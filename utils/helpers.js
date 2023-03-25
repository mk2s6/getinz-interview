const validatorLibrary = require('validator');

function isEmail(val) {
	return validatorLibrary.isEmail(val);
}

function isMobile(val) {
	return validatorLibrary.isMobilePhone(val);
}

module.exports = {
	isEmail,
	isMobile,
};
