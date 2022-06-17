const express = require('express');
const config = require('./config')
const compression = require('compression');
const methodOverride = require('method-override');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./corsOptions');
const credentials = require('../middlewares/credentials')
const morgan = require('./morgan');
const errorHandler = require('../middlewares/errorHandler');
// const passport = require('passport');
// const strategies = require('./passport');

const app = express();

// request logging in dev and production env
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
  app.use(morgan.fileReqLogger);
}

// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
//middleware for cookies
app.use(cookieParser());
// sanitize request data
app.use(xss());
app.use(mongoSanitize());
// gzip compression
app.use(compression());
// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());
// secure apps by setting various HTTP headers
app.use(helmet());

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);
// enable CORS - Cross Origin Resource Sharing
app.use(cors(corsOptions));
// enable authentication
// app.use(passport.initialize());
// passport.use('jwt', strategies.jwt);
// passport.use('facebook', strategies.facebook);
// passport.use('google', strategies.google);


// handle error
app.use(errorHandler);

module.exports = app;



























// mount api v1 routes
// app.use('/v1', routes);

// send back a 404 error for any unknown api request
// app.use((req, res, next) => {
//   next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
// });

// convert error to ApiError, if needed
// app.use(errorConverter);