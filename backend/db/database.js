const mongoose = require('mongoose');

connect = () => {
  mongoose.connect('mongodb+srv://aman9431257:6291643238@e-commerce.ixtkux9.mongodb.net/E-commerce?retryWrites=true&w=majority').then(() => {
    console.log('MongoDB connected');
  }).catch((err) => {
    console.log(`MongoDB cant connect ${err}`)
  })
}

module.exports = connect;