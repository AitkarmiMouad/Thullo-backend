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
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleSecretKey: process.env.GOOGLE_SECRET_KEY,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubSecretKey: process.env.GITHUB_SECRET_KEY,
  facebookClientId: process.env.FACEBOOK_CLIENT_ID,
  facebookSecretKey: process.env.FACEBOOK_SECRET_KEY,
  isDev: process.env.NODE_ENV === 'development' ? 1 : 0,
};
