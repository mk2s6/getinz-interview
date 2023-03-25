require('dotenv').config();

const app = require('./app');
const { connectToDB } = require('./database');
const { logConsole, logError } = require('./utils/logger');

const { MONGO_URL, PORT } = process.env;

connectToDB(MONGO_URL)
	.then(() => {
		logConsole(`Database connected to mongo at ${MONGO_URL}`);
		app.listen(PORT, () => {
			logConsole(`Server Started on port ${PORT}`);
		});
	})
	.catch(err => {
		logError(err);
	});
