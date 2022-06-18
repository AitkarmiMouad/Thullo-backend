const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleShema = new Schema({
  _id: {
    type: String,
    required: true
  },
  roleName: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('Role', roleShema)