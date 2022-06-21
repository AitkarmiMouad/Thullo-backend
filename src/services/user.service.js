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

const getUserFromEmail = async (email) => {
  const user = await User.findOne({ email: email }).exec()
  return user
}

const updateUser = async (payload) => {
  const { _id, firstName, lastName, pictureUrl, bio, phone, email, password } = payload
  try {

    const foundUser = await User.findOne({ _id: _id }).exec();

    firstName ? foundBoard.firstName = firstName : '';
    lastName ? foundBoard.lastName = lastName : ''
    pictureUrl ? foundBoard.pictureUrl = pictureUrl : ''
    bio ? foundBoard.bio = bio : ''
    phone ? foundBoard.phone = phone : ''
    email ? foundBoard.email = email : ''
    password ? foundBoard.password = password : ''

    const result = await foundUser.save();

    return result

  } catch (err) {
    throw new ApolloError(err.message, 'INTERNAL_SERVER_ERROR');
  }
}

const verifyRoles = (idUser, document, targetedRoles) => {
  const roles = ["admin", "editor", "viewer"]
  if (targetedRoles.map(val => !roles.includes(val)).find(val => val === true))
    throw new ApolloError('FORBIDDEN');

  let result;
  if (!document) throw new ApolloError('document not found');
  document.members.map(async (_, index) => {
    if (document.members[index]._id === idUser) {
      result = targetedRoles.includes(document.members[index].role)
    }
  })

  if (result) {
    return result // bool - false if doesn't exist true if does
  }
  else {
    throw new ApolloError('FORBIDDEN');
  }
}

module.exports = {
  createUser,
  getUserFromEmail,
  updateUser,
  verifyRoles,
};
