const { check, body, cookie, header, param, query, validationResult } = require('express-validator');
const PasswordValidator = require('password-validator');
const validatorLibrary = require('validator');
const dateAndTime = require('date-and-time');
const { validationError } = require('./response-generator');

function getFunctionName(location) {
	switch (location) {
		case 'body':
			return body;
		case 'cookie':
			return cookie;
		case 'header':
			return header;
		case 'param':
			return param;
		case 'query':
			return query;
		default:
			return check;
	}
}

function getValidationResult(object) {
	return validationResult(object);
}

const returnValidations = (req, res, next) => {
	const errors = getValidationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send(validationError(errors));
	}
	next();
};

function isEmail(location, email) {
	const validator = getFunctionName(location);
	return validator(email)
		.isEmail()
		.withMessage('Please enter a valid email-id')
		.isLength({ max: 150 })
		.withMessage('Email should not exceed maximum of 150 characters length')
		.trim();
}

function isArray(location, field) {
	const validator = getFunctionName(location);
	return validator(field).isArray().withMessage('Please provide valid items.');
}

function isPassword(location, password, message) {
	const schemaPassword = new PasswordValidator();
	schemaPassword.is().min(8).is().max(255).has().uppercase().has().lowercase().has().digits().has().symbols();

	const validator = getFunctionName(location);
	return validator(password).custom(paramPassword => {
		if (!schemaPassword.validate(paramPassword)) throw new Error(message);
		return true;
	});
}

function isOtp(location, otp) {
	const otpSchema = new PasswordValidator();
	otpSchema.is().min(4).is().max(4).digits();

	const validator = getFunctionName(location);
	return validator(otp).custom(paramOtp => {
		if (!otpSchema.validate(paramOtp)) throw new Error('Please provide valid OTP.!');
		return true;
	});
}

function isGender(location, gender) {
	const validator = getFunctionName(location);
	return validator(gender).isIn(['Male', 'Female', 'Others']).withMessage('please provide a valid gender');
}

function isValidStrLenWithTrim(location, fieldName, minLength = 0, maxLength = Number.POSITIVE_INFINITY, message = 'Please provide a valid string') {
	const validator = getFunctionName(location);
	return validator(fieldName).trim().isLength({ min: minLength, max: maxLength }).withMessage(message);
}

function isDateFormat(dateString) {
	if (dateAndTime.isValid(dateString, 'YYYY-MM-DD')) {
		return true;
	}
	return false;
}

function isDOB(location, dob) {
	const validator = getFunctionName(location);
	return validator(dob)
		.custom(paramDOB => {
			if (isDateFormat(paramDOB) && paramDOB >= '1940-01-01') {
				return true;
			}
			return false;
		})
		.withMessage('Date of Birth is not valid. DOB should be greater than 01 Jan 1940');
}

function isMobile(location, mobileNumber) {
	const validator = getFunctionName(location);
	return validator(mobileNumber)
		.isMobilePhone()
		.withMessage('Mobile number is not valid please check if you have entered a 10 digit mobile number');
}

function isEmailOrMobile(location, username) {
	const validator = getFunctionName(location);
	return validator(username)
		.custom(paramUsername => {
			if (validatorLibrary.isEmail(paramUsername) || validatorLibrary.isMobilePhone(paramUsername)) {
				return true;
			}
			throw false;
		})
		.withMessage('Please provide a valid Username or Email-id or Mobile Number!');
}

module.exports = { isEmail, isArray, isPassword, isOtp, isGender, isValidStrLenWithTrim, isDOB, isMobile, isEmailOrMobile, returnValidations };
