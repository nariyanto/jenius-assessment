let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let uniqueValidator = require('mongoose-unique-validator');

const ADMIN_ROLE = 1;
const USER_ROLE = 2;
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

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongoosePaginate);
var User = mongoose.model('User', userSchema);

module.exports.ADMIN_ROLE = ADMIN_ROLE
module.exports.USER_ROLE = USER_ROLE
module.exports = User;