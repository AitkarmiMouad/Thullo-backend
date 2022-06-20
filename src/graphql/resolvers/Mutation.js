const Board = require('../../model/Board');
const { handleLogin, handleLogout, handleRefresh } = require('../../services/auth.service');
const { createBoard, updateBoard, deleteBoard } = require('../../services/board.service');
const { verifyToken } = require('../../services/token.service');
const { createUser, getUserFromEmail, updateUser, verifyRoles } = require('../../services/user.service')

exports.Mutation = {
  addUser: async (parent, { input }, { request }) => {
    const user = await createUser(input)
    return user
  },
  updateUser: async (parent, { input }, { request }) => {
    verifyToken(request.req)
    const user = await updateUser(input)
    return user
  },
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
    verifyToken(request.req)
    const user = await getUserFromEmail(email)
    const foundBoard = await Board.findOne({ _id: _id }).exec()
    verifyRoles(user._id, foundBoard, ['admin'])
    const board = await deleteBoard(id)
    return board
  },
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
