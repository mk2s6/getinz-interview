const errList = require('./errorList');

function ErrorsObj(errMessage, errField, errLocation) {
	this.message = errMessage;
	this.field = errField;
	this.location = errLocation;
}

const respondSuccess = res => (resInfo, resItems) => {
	return res.status(200).send({
		data: {
			info: resInfo,
			data: resItems,
		},
	});
};

const respondInternalError =
	(res, status = 500) =>
	ERROR => {
		const errListObj = errList[ERROR];
		return res.status(status).send({
			type: 'INTERNAL_ERROR',
			code: errListObj.code,
			message: errListObj.message,
			errors: [],
		});
	};

function validationError(errors) {
	const errObj = {
		type: 'VALIDATION_ERROR',
		code: '',
		message: 'Validation failure.',
		errors: [],
	};
	const fields = errors.array();
	// Iterate through all errors we have
	for (let i = 0; i < fields.length; i += 1) {
		const err = fields[i];
		errObj.errors.push(new ErrorsObj(err.msg, err.param, err.location));
	}
	return errObj;
}

module.exports = { respondInternalError, respondSuccess, validationError };
