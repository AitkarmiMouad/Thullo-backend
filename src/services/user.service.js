const User = require('../model/User');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid')
const { ApolloError } = require('apollo-server-errors')

const createUser = async (payload) => {
  const { firstName, lastName, email, password } = payload
  if (!firstName || !lastName || !email || !password)
    throw new ApolloError('firstName, lastName, email, and password are required.', 'BAD_USER_INPUT');

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ email: email }).exec();
  if (duplicate) throw new ApolloError('user already created', 'Conflict');

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    //create and store the new user
    const result = await User.create({
      "_id": nanoid(),
      "firstName": firstName,
      "lastName": lastName,
      "email": email,
      "password": hashedPwd
    });

    return result

  } catch (err) {
    throw new ApolloError(err.message, 'INTERNAL_SERVER_ERROR');
  }
}


// const verifyRoles = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (!req?.roles) return res.sendStatus(401);
//     const rolesArray = [...allowedRoles];
//     const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
//     if (!result) return res.sendStatus(401);
//     next();
//   }
// }

module.exports = {
  createUser,
  // queryUsers,
  // getUserById,
  // getUserByEmail,
  // updateUserById,
  // deleteUserById,
  // verifyRoles,
  // resetPassword,
};
