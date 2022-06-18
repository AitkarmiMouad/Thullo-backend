const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  members: {
    type: [{
      id: String,
      role: String,
    }],
    required: true
  },
  coverUrl: String,
  createdAt: {
    type: String,
    required: true
  },
  labels: {
    type: [{
      id: String,
    }],
  },
  attachements: {
    type: [{
      id: String,
      attachementUrl: {
        type: String,
        required: true
      },
      coverUrl: String,
      title: String,
      createdAt: {
        type: String,
        required: true
      },
    }]
  },
  comments: {
    type: [{
      id: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      userId: {
        type: String,
        required: true
      },
      createdAt: {
        type: String,
        required: true
      },
    }]
  },
})

module.exports = mongoose.model('Card', cardSchema)