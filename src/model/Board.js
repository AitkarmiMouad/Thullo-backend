const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  coverUrl: String,
  visibility: {
    type: Boolean,
    required: true
  },
  description: String,
  members: {
    type: [{
      _id: String,
      role: String,
    }],
    required: true
  },
  list: {
    type: [{
      _id: String,
    }],
  },
  labels: {
    type: [{
      _id: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: true
      },
    }],
  },
  createdAt: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('Board', boardSchema)