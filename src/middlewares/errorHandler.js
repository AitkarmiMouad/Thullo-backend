const { isDev } = require('../config/config');
const logger = require('../config/logger');
const logInFile = require('../utils/logInFile')
const { format } = require('date-fns');


const errorHandler = (err, req, res, next) => {
  if (isDev) {
    const errMessage = `${err.name}: ${err.message} - ${format(new Date(), 'yyyy/MM/dd-HH:mm:ss')} `;
    logInFile('errLog.log', errMessage)
    logger.error(err.stack)
    res.status(500).send(err.message);
  }
}

module.exports = errorHandler;