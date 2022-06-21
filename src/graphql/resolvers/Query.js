const { getAllPublicBoards, getUserBoards } = require("../../services/board.service");
const { getCardsInList } = require("../../services/card.service");
const { getListsInBoard } = require("../../services/list.service");
const { verifyToken } = require("../../services/token.service");
const { getUserFromEmail } = require("../../services/user.service");

exports.Query = {
  // boards Queries
  allPublicBoards: async (parent, args, { request }) => {
    verifyToken(request.req)
    return await getAllPublicBoards()
  },
  getUserBoards: async (parent, args, { request }) => {
    const email = verifyToken(request.req)
    const user = await getUserFromEmail(email)
    return await getUserBoards(user._id)
  },
  // users Queries
  getUser: async (parent, args, { request }) => {
    const email = verifyToken(request.req)
    const user = await getUserFromEmail(email)
    return user
  },
  // list Queries
  getList: async (parent, { idBoard }, { request }) => {
    const email = verifyToken(request.req)
    const lists = await getListsInBoard(idBoard)
    return lists
  },
  // Card Queries
  getCard: async (parent, { idList }, { request }) => {
    const email = verifyToken(request.req)
    const cards = await getCardsInList(idList)
    return cards
  }
};
