const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    hello: String
  }
  type Mutation {
    addUser(input: AddUserInput!): User!
    login(input: LoginInput!): String!
    logout(input:Boolean): Boolean!
    refresh(input:Boolean): String
  }
  type User{
    _id: String!,
    firstName: String!,
    lastName: String!,
    email: String!,
    password: String!,
  }
  input AddUserInput{
    firstName: String!,
    lastName: String!,
    email: String!,
    password: String!,
  }
  input LoginInput{
    email: String!,
    password: String!,
  }
`;

module.exports = { typeDefs }