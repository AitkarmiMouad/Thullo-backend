const jwt = require('jsonwebtoken');
const config = require('../config/config')
const { ApolloError } = require('apollo-server-errors')

const generateAccessToken = (user) => {
  // create access token
  const accessToken = jwt.sign(
    {
      "UserInfo": {
        "email": `${user.email}`,
      }
    },
    config.accessTokenSecret,
    { expiresIn: config.accessTokenExpiration }
  );
  return accessToken;
}

const generateRefreshToken = (user) => {
  // create refresh token
  const refreshToken = jwt.sign(
    { "email": `${user.email}` },
    config.refreshTokenSecret,
    { expiresIn: config.refreshTokenExpiration }
  );
  return refreshToken;
}

// gonna return 0 if invalid or the fullName if valid
// type must be access access or refresh
const verifyToken = (req) => {
  if (!req.cookies.jwt) throw new ApolloError('FORBIDDEN')
  const token = req.cookies.jwt
  let email;
  jwt.verify(
    token,
    config.refreshTokenSecret,
    (err, decoded) => {
      if (err) throw new ApolloError('FORBIDDEN')//invalid token
      email = decoded.email
    }
  );
  return email
}


module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
