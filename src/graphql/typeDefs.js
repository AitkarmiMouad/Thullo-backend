const { gql } = require("apollo-server-express");

const typeDefs = gql`
# Types
  type Query {
    # user queries
    getUser: User!
    # board queries
    allPublicBoards: [Board]
    getUserBoards: [Board]
  }
  type Mutation {
    # user operations
    addUser(input: AddUserInput!): User!
    updateUser(input: updateUserInput!): User!
    # board operations
    addBoard(input: AddBoardInput!): Board!
    updateBoard(input: updateBoardInput!): Board!
    deleteBoard(id: ID!): Boolean!
    # authentification operations
    login(input: LoginInput!): String!
    logout(input:Boolean): Boolean!
    refresh(input:Boolean): String
  }
  type User{
    _id: ID!,
    firstName: String!,
    lastName: String!,
    pictureUrl: String,
    bio: String,
    phone: String,
    email: String!,
    password: String!,
  }
  type Board{
    _id: ID!,
    title: String!,
    coverUrl: String,
    visibility: Boolean!,
    description: String,
    members: [Members!]!,
    list: [List],
    createdAt: String!,
  }
  type List{
    _id: ID!,
    title: String!,
    cards: [Card],
  }
  type Card{
    _id: ID!,
    title: String!,
    description: String,
    members: [Members!]!,
    coverUrl: String,
    createdAt: String!,
    labels: [Labels],
    attachements: [Attachements],
    comments: [Comments]
  }
  type Labels{
    _id: ID!,
    text: String!,
    color: String!,
  }
  type Attachements{
    _id: ID!,
    attachementUrl: String!,
    coverUrl: String,
    title: String,
    createdAt: String!,
  }
  type Comments{
    _id: ID!,
    text: String!,
    userId: String!,
    createdAt: String!,
  }
  type Members{
    _id: ID!,
    role: String!
  }

# Inputs
  input AddUserInput{
    firstName: String!,
    lastName: String!,
    email: String!,
    password: String!,
  }
  input updateUserInput{
    _id: ID!,
    firstName: String,
    lastName: String,
    pictureUrl: String,
    bio: String,
    phone: String,
    email: String,
    password: String,
  }
  input AddBoardInput{
    title: String!,
    coverUrl: String,
    visibility: Boolean!,
  }
  input updateBoardInput{
    _id: ID!
    title: String,
    coverUrl: String,
    visibility: Boolean,
    description: String,
    members: [MembersInput!],
    list: [ListInput!],
  }
  input MembersInput{
    _id: ID!,
    role: String!
  }
  input ListInput{
    _id: ID!,
    title: String!,
    cards: [CardInput!],
  }
  input CardInput{
    _id: ID!,
    title: String!,
    description: String,
    members: [MembersInput!],
    coverUrl: String,
    labels: [LabelsInput!],
    attachements: [AttachementsInput!],
    comments: [CommentsInput!]
  }
  input LabelsInput{
    _id: ID!,
    text: String!,
    color: String!,
  }
  input AttachementsInput{
    _id: ID!,
    attachementUrl: String!,
    coverUrl: String,
    title: String,
  }
  input CommentsInput{
    _id: ID!,
    text: String!,
  }
  input LoginInput{
    email: String!,
    password: String!,
  }
`;

module.exports = { typeDefs }