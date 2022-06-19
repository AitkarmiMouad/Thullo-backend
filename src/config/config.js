const { config } = require("dotenv");

// import .env variables
config();

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
  refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION,
  mongoURL: process.env.MONGODB_URL,
  isDev: process.env.NODE_ENV === 'development' ? 1 : 0,
};
