const { getAllPublicBoards, getUserBoards } = require("../../services/board.service");
const { verifyToken } = require("../../services/token.service");
const { getUserFromEmail } = require("../../services/user.service");

exports.Query = {
  allPublicBoards: async (parent, args, { request }) => {
    verifyToken(request.req)
    return await getAllPublicBoards()
  },
  getUserBoards: async (parent, args, { request }) => {
    const email = verifyToken(request.req)
    const user = await getUserFromEmail(email)
    return await getUserBoards(user._id)
  },
  getUser: async (parent, args, { request }) => {
    const email = verifyToken(request.req)
    const user = await getUserFromEmail(email)
    return user
  }
};
