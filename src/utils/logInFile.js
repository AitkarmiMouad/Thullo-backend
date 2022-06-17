const { v4: uuid } = require('uuid');
const logger = require('../config/logger');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// create a write stream in file (in append mode)
var logFileStream = async (logFileName, logItem) => {
  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    }

    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), `${logItem} - ${uuid()}\n`);
  } catch (err) {
    logger.error(err);
  }
}

module.exports = logFileStream