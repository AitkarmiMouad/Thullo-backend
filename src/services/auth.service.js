const User = require('../model/User');
const { generateAccessToken, generateRefreshToken } = require('./token.service')
const bcrypt = require('bcrypt');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const { ApolloError } = require('apollo-server-errors')

const handleLogin = async (req, res, payload) => {
  const { email, password } = payload
  const cookies = req.cookies;
  console.log(`cookie available at login: ${JSON.stringify(cookies)}`);

  if (!email || !password) throw new ApolloError('Email, and password are required.', 'BAD_USER_INPUT');

  const foundUser = await User.findOne({ email: email }).exec();
  if (!foundUser) throw new ApolloError('Unauthorized', 'FORBIDDEN'); //Unauthorized 
  // evaluate password 
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    // const roles = Object.values(foundUser.roles).filter(Boolean);
    // create JWTs
    const accessToken = generateAccessToken(foundUser)
    const newRefreshToken = generateRefreshToken(foundUser)

    // Changed to let keyword
    let newRefreshTokenArray =
      !cookies?.jwt
        ? foundUser.refreshToken
        : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

    if (cookies?.jwt) {

      /* 
      Scenario added here: 
          1) User logs in but never uses RT and does not logout 
          2) RT is stolen
          3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
      */
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();

      // Detected refresh token reuse!
      // ila malgach user = malgach RefrechToken f Db = attempt is with using a old token or invalid one
      // Our goal is to find the refreshToken in db wich prove that the token is still valid and no one used it
      if (!foundToken) {
        console.log('attempted refresh token reuse at login!')
        // clear out ALL previous refresh tokens
        newRefreshTokenArray = [];
      }

      res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: false });
    }

    // Saving refreshToken with current user
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();

    // Creates Secure Cookie with refresh token
    res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: false, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

    // Send authorization roles and access token to user
    return accessToken

  } else {
    throw new ApolloError('INTERNAL_SERVER_ERROR')
  }
}

const handleLogout = async (req, res) => {
  //. On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return true //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return true
  }

  // Delete refreshToken in db
  foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);;
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  return true
}

const handleRefresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) throw new ApolloError('Unauthorized', 'FORBIDDEN');
  const refreshToken = cookies.jwt;

  console.log(refreshToken)

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: false });

  const foundUser = await User.findOne({ refreshToken }).exec();

  // Detected refresh token reuse! / RefreshToken Not In DB
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      config.refreshTokenSecret,
      async (err, decoded) => {
        if (err) throw new ApolloError('Unauthorized', 'FORBIDDEN'); //Forbidden
        console.log('attempted refresh token reuse!')
        const hackedUser = await User.findOne({ email: decoded.email }).exec();
        hackedUser.refreshToken = [];
        const result = await hackedUser.save();
        console.log(result);
      }
    )
    throw new ApolloError('Unauthorized', 'FORBIDDEN'); //Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

  const accessToken = generateAccessToken(foundUser)
  const newRefreshToken = generateRefreshToken(foundUser)

  // evaluate jwt 
  jwt.verify(
    refreshToken,
    config.refreshTokenSecret,
    async (err, decoded) => {
      if (err) {
        console.log('expired refresh token')
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = await foundUser.save();
        console.log(result);
      }
      if (err || foundUser.email !== decoded.email) throw new ApolloError('Unauthorized', 'FORBIDDEN');

      // Refresh token was still valid
      // const roles = Object.values(foundUser.roles);

      // Saving refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();

    }
  );
  // code gonna arrive here unless everything is looking good
  // Creates Secure Cookie with refresh token
  res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: false, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
  return accessToken
}

module.exports = {
  handleLogin,
  handleLogout,
  handleRefresh,
};
