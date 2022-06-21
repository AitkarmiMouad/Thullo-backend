const Board = require('../model/Board');
const List = require('../model/List');
const { ApolloError } = require('apollo-server-errors')
const { nanoid } = require('nanoid');
const { updateBoard } = require('./board.service');

const getListsInBoard = async (idBoard) => {
  const foundBoard = await Board.findOne({ _id: idBoard }).exec()

  if (!foundBoard) throw new ApolloError('Board Not Found');

  if (foundBoard.list.length < 1) return []

  const result = foundBoard.list.map(async ({ _id }) => {
    const list = await List.findOne({ _id: _id }).exec()
    if (list) {
      return list
    }
  })

  return result

}

const createList = async (payload) => {
  const { idBoard, title } = payload
  if (!idBoard || !title)
    throw new ApolloError('title and idBoard are required.', 'BAD_USER_INPUT');


  try {
    //create and store the new list
    const result = await List.create({
      "_id": nanoid(),
      "title": title,
    });

    const foundBoard = await Board.findOne({ _id: idBoard }).exec();

    await updateBoard({ _id: idBoard, list: [...foundBoard.list, { _id: result._id }] })

    return result

  } catch (err) {
    throw new ApolloError(err.message, 'INTERNAL_SERVER_ERROR');
  }
}

const updateList = async (payload) => {
  const { _id, title, cards } = payload
  try {

    const foundList = await List.findOne({ _id: _id }).exec();

    title ? foundList.title = title : '';
    cards ? foundList.cards = cards : '';

    const result = await foundList.save();

    return result

  } catch (err) {
    throw new ApolloError(err.message, 'INTERNAL_SERVER_ERROR');
  }
}

const deleteList = async (payload) => {
  const { _id, idBoard } = payload
  try {

    const foundBoard = await Board.findOne({ _id: idBoard }).exec();

    const result = await List.deleteOne({ _id: _id }).exec()

    foundBoard.list.map(async (_, index) => {
      if (foundBoard.list[index]._id === _id) {
        foundBoard.list = foundBoard.list.filter((val) => { return val._id !== _id });
      }
    })

    await foundBoard.save();

    return result.deletedCount // 0 or 1 because we using deleteOne
  }
  catch (err) {
    throw new ApolloError(err.message, 'INTERNAL_SERVER_ERROR');
  }
}


module.exports = {
  getListsInBoard,
  createList,
  updateList,
  deleteList
};
