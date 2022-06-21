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
const { isDev } = require('./config');
const authRoute = require("../routes/auth");
const cookieSession = require("cookie-session");
const passportSetup = require("./passport");
const passport = require('passport');

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
app.use(helmet({
  crossOriginEmbedderPolicy: !isDev,
  contentSecurityPolicy: !isDev,
}));

app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);
// enable CORS - Cross Origin Resource Sharing
app.use(cors(corsOptions));


// auth route for sso with google/fb/github
app.use("/auth", authRoute);

// handle error
app.use(errorHandler);

module.exports = app;
