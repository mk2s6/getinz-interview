var express = require('express');
const Users = require('../models/Users');
const { respondSuccess, respondInternalError } = require('../utils/response-generator');
const { isEmailOrMobile, returnValidations, isOtp } = require('../utils/validator-sanitizer');
const { isEmail } = require('../utils/helpers');
const { genAuthToken, validateOTPToken, validateUserToken } = require('../utils/auth');

const router = express.Router();

/* GET users listing. */
router.post('/generate-otp', [isEmailOrMobile('body', 'username'), returnValidations], async function (req, res, next) {
	let user = [];
	let userName = req.body.username;

	const whereCondition = {};

	if (isEmail(userName)) {
		whereCondition.email = userName;
	} else {
		whereCondition.phone = userName;
	}

	user = await Users.findOne({
		...whereCondition,
	}).exec();

	if (!user) {
		user = await Users.create({ ...whereCondition });
	}

	const otpToken = genAuthToken({ user_id: user._id, token_type: 'OTP' }, false);

	res.setHeader('token', otpToken);

	return respondSuccess(res)('User Generate OTP', { otpToken: otpToken, ...whereCondition });
});

router.post('/validate-otp', validateOTPToken, [isOtp('body', 'otp'), returnValidations], async (req, res) => {
	const OTP = req.body.otp;

	if (OTP !== '9999') {
		return respondInternalError(res, 400)('INVALID_OTP');
	}

	const user = await Users.findById(req.user.user_id).exec();

	const userToken = genAuthToken({ user_id: user._id, token_type: 'USER' }, true);

	await Users.findByIdAndUpdate(req.user.user_id, { loginStatus: true, activeToken: userToken }).exec();

	res.setHeader('token', userToken);
	return respondSuccess(res)('User Generate OTP', { user, token: userToken });
});

router.get('/all', validateUserToken, async (req, res) => {
	const users = await Users.find({ loginStatus: true }, { activeToken: 0 }).exec();
	return respondSuccess(res)('User Generate OTP', { users });
});

router.post('/logout', validateUserToken, async (req, res) => {
	await Users.findByIdAndUpdate(req.user._id, { loginStatus: false, activeToken: '' }).exec();
	return respondSuccess(res)('User Logout successful');
});

module.exports = router;
