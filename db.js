const mongoose = require("mongoose");
require("dotenv").config();

mongoose.Promise = global.Promise;

mongoose.Promise = global.Promise;

const connect = (opts = {}) => {
  let url;
  switch (process.env.NODE_ENV) {
    case "test":
      url = process.env.DB_URL_TEST;
      break;
    default:
      url = process.env.DB_URL;
  }
  
  
  return mongoose.connect(url, {
    ...opts,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
};

const close = () => {
  return mongoose.connection.close();
};

const getConnection = () => {
  return mongoose.connection;
};

module.exports = { connect, close, getConnection };
