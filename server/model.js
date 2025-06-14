const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {type: String, required: true},
  highScore: {type: Number, required: true}
});

const User = mongoose.model('User', userSchema);

module.exports = User;