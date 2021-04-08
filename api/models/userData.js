const mongoose = require('mongoose');

const pokemonCollectionSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    unique: true,
  },
});

const userDataSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
    unique: true,
  },
  credits: {
    type: Number,
    default: 1000,
  },
  pokemonCollection: [pokemonCollectionSchema],
});

module.exports = mongoose.model('userData', userDataSchema);
