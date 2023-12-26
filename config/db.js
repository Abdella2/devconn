const mongoose = require('mongoose');
const config = require('config');
const serverInfo = require('debug')('app:server');

const { protocol, username, password, host, options } = config.get('db');
const dbUrl = `${protocol}${username}:${password}@${host}?${options}`;

const connectToDB = async () => {
  try {
    serverInfo('Connecting to mongodb...');

    await mongoose.connect(dbUrl);

    serverInfo('Connected to mongodb.');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectToDB;
