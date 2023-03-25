const jwt = require('jsonwebtoken');
const { logError, logConsole } = require('./logger');
const RG = require('./response-generator');

const jwtSecret = process.env.JWT_SECRET;

function genAuthToken(payload, remember) {
	return jwt.sign(payload, jwtSecret, { expiresIn: remember ? '2d' : '30m' });
}

function validateOTPToken(req, res, next) {
	const token = req.header('token');
	if (token) {
		try {
			if (req.user === null || req.user === undefined) {
				const payload = jwt.verify(token, jwtSecret);
				req.user = payload;
			}
			if (req.user.token_type !== 'OTP') {
				return RG.respondInternalError(res, 403)('ERR_TOKEN_INVALID');
			}

			next();
		} catch (e) {
			logError(e);
			if (e.name === 'TokenExpiredError') {
				return RG.respondInternalError(res, 403)('ERR_TOKEN_EXPIRED');
			}
			return RG.respondInternalError(res, 403)('ERR_TOKEN_INVALID');
		}
	} else {
		return RG.respondInternalError(res, 401)('ERR_TOKEN_NOT_GIVEN');
	}
}

function validateUserToken(req, res, next) {
	const token = req.header('token');
	if (token) {
		try {
			if (req.user === null || req.user === undefined) {
				const payload = jwt.verify(token, jwtSecret);
				req.user = payload;
			}
			next();
		} catch (e) {
			logError(e);
			if (e.name === 'TokenExpiredError') {
				return RG.respondInternalError(res, 403)('ERR_TOKEN_EXPIRED');
			}
			return RG.respondInternalError(res, 403)('ERR_TOKEN_INVALID');
		}
	} else {
		return RG.respondInternalError(res, 403)('ERR_TOKEN_NOT_GIVEN');
	}
}

module.exports = { genAuthToken, validateOTPToken, validateUserToken };
