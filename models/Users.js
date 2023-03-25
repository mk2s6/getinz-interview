const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		name: {
			type: Schema.Types.String,
		},
		phone: {
			type: Schema.Types.String,
		},
		email: {
			type: Schema.Types.String,
		},
		activeToken: {
			type: Schema.Types.String,
		},
		loginStatus: {
			type: Schema.Types.Boolean,
			default: false,
		},
	},
	{ timestamps: true, versionKey: false },
);

const Users = mongoose.model('users', UserSchema);

Users.init();

module.exports = Users;
