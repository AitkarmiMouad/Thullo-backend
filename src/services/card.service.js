const List = require('../model/List');
const Card = require('../model/Card');
const { ApolloError } = require('apollo-server-errors')
const { nanoid } = require('nanoid');
const { updateList } = require('./list.service');
const { format } = require('date-fns');
const Board = require('../model/Board');

const getCardsInList = async (idList) => {
  const foundList = await List.findOne({ _id: idList }).exec()

  if (!foundList) throw new ApolloError('List Not Found');

  if (foundList.cards.length < 1) return cardArray

  const result = foundList.cards.map(async ({ _id }) => {
    const card = await Card.findOne({ _id: _id }).exec()
    if (card) {
      return card
    }
  })

  return result

}

const createCard = async (payload, userId) => {
  const { idList, title } = payload
  if (!idList || !title)
    throw new ApolloError('title and idList are required.', 'BAD_USER_INPUT');

  try {

    const foundList = await List.findOne({ _id: idList }).exec();

    if (!foundList) throw new ApolloError('List Not Found');

    //create and store the new card
    const result = await Card.create({
      "_id": nanoid(),
      "title": title,
      "members": [{ "_id": userId, "role": "admin" }],
      "createdAt": `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    });


    await updateList({ _id: idList, cards: [...foundList.cards, { _id: result._id }] })

    return result

  } catch (err) {
    throw new ApolloError(err.message, 'INTERNAL_SERVER_ERROR');
  }
}

const updateCard = async (payload) => {
  const { _id, idBoard, title, description, members, coverUrl, labels, attachements, comments } = payload
  try {

    const foundCard = await Card.findOne({ _id: _id }).exec();
    const foundBoard = await Board.findOne({ _id: idBoard }).exec();

    title ? foundCard.title = title : '';
    description ? foundCard.description = description : ''
    coverUrl ? foundCard.coverUrl = coverUrl : ''
    if (members) {
      members.map(async ({ _id, role }) => {
        foundCard.members.map(async (_, index) => {
          if (foundCard.members[index]._id === _id) {
            foundCard.members[index].role = role
          }
        })
      })
    }
    if (labels) {
      foundBoard.labels = [...foundBoard.labels, ...labels]
      labels.map(async ({ _id }) => {
        foundCard.labels = [...foundCard.labels, { _id: _id }]
      })
    }
    attachements ? foundCard.attachements = attachements : ''
    comments ? foundCard.comments = comments : ''


    await foundBoard.save();
    const result = await foundCard.save();

    return result

  } catch (err) {
    throw new ApolloError(err.message, 'INTERNAL_SERVER_ERROR');
  }
}

const deleteCard = async (payload) => {
  const { _id, idList } = payload
  try {

    const foundList = await List.findOne({ _id: idList }).exec();

    const result = await Card.deleteOne({ _id: _id }).exec()

    foundList.cards.map(async (card, index) => {
      if (card._id === _id) {
        foundList.cards = foundList.cards.filter((val) => { return val._id !== _id });
      }
    })

    await foundList.save();

    return result.deletedCount // 0 or 1 because we using deleteOne
  }
  catch (err) {
    throw new ApolloError(err.message, 'INTERNAL_SERVER_ERROR');
  }
}


module.exports = {
  getCardsInList,
  createCard,
  updateCard,
  deleteCard
};
