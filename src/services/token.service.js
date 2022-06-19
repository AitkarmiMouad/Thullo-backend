const jwt = require('jsonwebtoken');
const config = require('../config/config')

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
const verifyToken = (token, type) => {
  // const authHeader = req.headers.authorization || req.headers.Authorization;
  // if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
  // const token = authHeader.split(' ')[1];
  // console.log(token)
  // jwt.verify(
  //   token,
  //   type === 'access' ? config.accessTokenSecret : config.refreshTokenSecret,
  //   (err, decoded) => {
  //     if (err) return 0 //invalid token
  //     return decoded.UserInfo.fullName
  //   }
  // );
}

// Is refreshToken in db?
const tokenExist = (token) => {

}


// save Token in user
const saveToken = (token,userId) => {

}

// delete Token from user
const deleteToken = (token,userId) => {

}


module.exports = {
  generateAccessToken,
  generateRefreshToken,
  saveToken,
  verifyToken,
  tokenExist,
  deleteToken
};
