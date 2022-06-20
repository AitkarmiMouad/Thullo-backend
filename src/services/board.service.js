const Board = require('../model/Board');
const { ApolloError } = require('apollo-server-errors')
const { format } = require('date-fns');
const { nanoid } = require('nanoid')

const getAllPublicBoards = async () => {
  return await Board.find({ visibility: true }).exec()
}

const getUserBoards = async (userId) => {
  return await Board.find({ "members._id": userId }).exec()
}

const createBoard = async (payload, userId) => {
  const { title, coverUrl, visibility } = payload
  if (!title || !coverUrl || visibility === undefined)
    throw new ApolloError('title, coverUrl and visibility are required.', 'BAD_USER_INPUT');

  try {
    //create and store the new user
    const result = await Board.create({
      "_id": nanoid(),
      "title": title,
      "coverUrl": coverUrl,
      "visibility": visibility,
      "members": [{ "_id": userId, "role": "admin" }],
      "createdAt": `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    });

    return result

  } catch (err) {
    throw new ApolloError(err.message, 'INTERNAL_SERVER_ERROR');
  }
}

const updateBoard = async (payload) => {
  const { _id, title, coverUrl, visibility, description, members, list } = payload
  try {

    const foundBoard = await Board.findOne({ _id: _id }).exec();

    title ? foundBoard.title = title : '';
    coverUrl ? foundBoard.coverUrl = coverUrl : ''
    visibility !== undefined ? foundBoard.visibility = visibility : ''
    description ? foundBoard.description = description : ''
    if (members) {
      members.map(async ({ _id, role }) => {
        foundBoard.members.map(async (_, index) => {
          if (foundBoard.members[index]._id === _id) {
            foundBoard.members[index].role = role
          }
        })
      })
    }
    list ? foundBoard.list = list : ''

    const result = await foundBoard.save();

    return result

  } catch (err) {
    throw new ApolloError(err.message, 'INTERNAL_SERVER_ERROR');
  }
}

const deleteBoard = async (userId) => {
  const result = await Board.deleteOne({ _id: userId }).exec()
  return result.deletedCount // 0 or 1 because we using deleteOne
}


module.exports = {
  getAllPublicBoards,
  getUserBoards,
  createBoard,
  updateBoard,
  deleteBoard
};
