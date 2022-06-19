const morgan = require('morgan');
const { format } = require('date-fns');
const { isDev } = require('./config');
const logger = require('./logger');
const chalk = require('chalk')
const logInFile = require('../utils/logInFile')

morgan.token('message', (req, res) => res.statusMessage || '');
morgan.token('datetime', (req, res) => `${format(new Date(), 'yyyy/MM/dd-HH:mm:ss')}`);

const getIpFormat = () => (!isDev ? 'ip-format: :remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url ${chalk.yellow(':status')} - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url ${chalk.yellow(':status')} - :response-time ms - message: :message`;
const fileLogFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message - datetime: :datetime `;

const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => { logger.info(message.trim()) } },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => { logger.error(message.trim()) } },
});

const fileReqLogger = morgan(fileLogFormat, {
  stream: { write: (message) => { logInFile('reqLog.log', message.trim()) } },
})

module.exports = {
  successHandler,
  errorHandler,
  fileReqLogger
};
