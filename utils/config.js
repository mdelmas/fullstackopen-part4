require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.NODE_ENV === 'production' ?
  process.env.MONGODB_URI
  : process.env.MONGODB_URI_TEST;

module.exports = {
  PORT,
  MONGODB_URI
};