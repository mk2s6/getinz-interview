const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

async function connectToDB(MONGO_URL) {
  if (MONGO_URL) return mongoose.connect(process.env.MONGO_URL);
  throw new Error({ message: 'Please provide Mongo connection url' });
}
module.exports = { connectToDB };
