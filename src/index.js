const app = require('./config/express');
const { port } = require('./config/config')
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const { ApolloServer } = require('apollo-server-express')
const { typeDefs } = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const PORT = port || 4000

// Connect to MongoDB
connectDB();

// apolloServer - Graphql
async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: (request) => { return { request } },
    csrfPrevention: true,
    cache: 'bounded',
  });
  await server.start();
  server.applyMiddleware({ app });
}
startApolloServer(typeDefs, resolvers)

// Connect to mongodb then start express server
mongoose.connection.once('open', () => {
  console.log('🔗 Connected to MongoDB');
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});