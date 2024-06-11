const mongoose = require('mongoose');

const accSchema = mongoose.Schema({
  account: {
    type: Number,
  }
});

module.exports = mongoose.model('Account', accSchema);