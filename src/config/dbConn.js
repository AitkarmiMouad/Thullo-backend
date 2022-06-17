const mongoose = require('mongoose');
const { mongoURL } = require('./config');
const logger = require('./logger');

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  } catch (err) {
    logger.error(err);
  }
}

module.exports = connectDB