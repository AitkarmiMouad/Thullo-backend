const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  pictureUrl: String,
  bio: String,
  phone: String,
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('User', userSchema)