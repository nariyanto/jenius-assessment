let mongoose = require('mongoose');

const USER_ROLE = 2;
const ADMIN_ROLE = 1;
const { Schema } = mongoose;
const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  accountNumber: {
    type: Number,
    required: true,
    unique: true
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  identityNumber: {
    type: Number,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    default: 2,
    required: true,
    type: Number,
  },
});

var User = mongoose.model('User', userSchema);

module.exports = ADMIN_ROLE
module.exports = USER_ROLE
module.exports = User;