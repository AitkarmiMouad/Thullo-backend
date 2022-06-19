const { logger } = require('../../config/logger');
const { handleLogin, handleLogout, handleRefresh } = require('../../services/auth.service');
const { createUser } = require('../../services/user.service')

exports.Mutation = {
  addUser: async (parent, { input }, { request }) => {
    const user = await createUser(input)
    return user
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
