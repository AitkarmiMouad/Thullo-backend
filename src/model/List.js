const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  cards: {
    type: [{
      id: String,
    }],
  },
})

module.exports = mongoose.model('List', listSchema)