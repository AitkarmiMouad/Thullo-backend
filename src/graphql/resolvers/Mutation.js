const Board = require('../../model/Board');
const { handleLogin, handleLogout, handleRefresh } = require('../../services/auth.service');
const { createBoard, updateBoard, deleteBoard } = require('../../services/board.service');
const { verifyToken } = require('../../services/token.service');
const { createUser, getUserFromEmail, updateUser, verifyRoles } = require('../../services/user.service')
const { createList, updateList, deleteList } = require('../../services/list.service');
const List = require('../../model/List');
const { createCard, deleteCard, updateCard } = require('../../services/card.service');
const Card = require('../../model/Card');

exports.Mutation = {
  // users mutations
  addUser: async (parent, { input }, { request }) => {
    const user = await createUser(input)
    return user
  },
  updateUser: async (parent, { input }, { request }) => {
    verifyToken(request.req)
    const user = await updateUser(input)
    return user
  },
  // boards mutations
  addBoard: async (parent, { input }, { request }) => {
    const email = verifyToken(request.req)
    const user = await getUserFromEmail(email)
    const board = await createBoard(input, user._id)
    return board
  },
  updateBoard: async (parent, { input }, { request }) => {
    const email = verifyToken(request.req)
    const user = await getUserFromEmail(email)
    const foundBoard = await Board.findOne({ _id: input._id }).exec()
    verifyRoles(user._id, foundBoard, ['admin'])
    const board = await updateBoard(input)
    return board
  },
  deleteBoard: async (parent, { id }, { request }) => {
    const email = verifyToken(request.req)
    const user = await getUserFromEmail(email)
    const foundBoard = await Board.findOne({ _id: id }).exec()
    verifyRoles(user._id, foundBoard, ['admin'])
    const board = await deleteBoard(id)
    return board
  },
  // List Mutations
  addList: async (parent, { input }, { request }) => {
    const email = verifyToken(request.req)
    const user = await getUserFromEmail(email)
    const foundBoard = await Board.findOne({ _id: input.idBoard }).exec()
    verifyRoles(user._id, foundBoard, ['admin', 'editor'])
    const list = await createList(input)
    return list
  },
  updateList: async (parent, { input }, { request }) => {
    const email = verifyToken(request.req)
    const user = await getUserFromEmail(email)
    const foundBoard = await Board.findOne({ _id: input.idBoard }).exec()
    verifyRoles(user._id, foundBoard, ['admin', 'editor'])
    const list = await updateList(input)
    return list
  },
  deleteList: async (parent, { input }, { request }) => {
    const email = verifyToken(request.req)
    const user = await getUserFromEmail(email)
    const foundBoard = await Board.findOne({ _id: input.idBoard }).exec()
    verifyRoles(user._id, foundBoard, ['admin'])
    const list = await deleteList(input)
    return list
  },
  // Card Mutaions
  addCard: async (parent, { input }, { request }) => {
    const email = verifyToken(request.req)
    const user = await getUserFromEmail(email)
    const foundBoard = await Board.findOne({ _id: input.idBoard }).exec()
    verifyRoles(user._id, foundBoard, ['admin', 'editor'])
    const card = await createCard(input, user._id)
    return card
  },
  updateCard: async (parent, { input }, { request }) => {
    const email = verifyToken(request.req)
    const user = await getUserFromEmail(email)
    const foundCard = await Card.findOne({ _id: input._id }).exec()
    verifyRoles(user._id, foundCard, ['admin', 'editor'])
    const card = await updateCard(input)
    return card
  },
  deleteCard: async (parent, { input }, { request }) => {
    const email = verifyToken(request.req)
    const user = await getUserFromEmail(email)
    const foundBoard = await Board.findOne({ _id: input.idBoard }).exec()
    verifyRoles(user._id, foundBoard, ['admin', 'editor'])
    const card = await deleteCard(input)
    return card
  },
  // Auth Mutations
  login: async (parent, { input }, { request }) => {
    const login = await handleLogin(request.req, request.res, input)
    return login
  },
  logout: async (parent, args, { request }) => {
    const logout = await handleLogout(request.req, request.res)
    return logout
  },
  refresh: async (parent, args, { request }) => {
    const refresh = await handleRefresh(request.req, request.res)
    return refresh
  }
};
