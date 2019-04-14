var User = require('../api/resources/user/user.model')
var userService = require('../api/resources/user/user.service');
var mongoose = require('mongoose');

const {getConfig} = require('../config/config');

const config = getConfig(process.env.NODE_ENV);
mongoose.Promise = global.Promise;
mongoose.connect(config.MONGO_URI, { useNewUrlParser: true });

const runSeed = async () => {
  try {
    const user = await User.create({
      userName: 'admin',
      accountNumber: 123456,
      emailAddress: 'admin@mail.com',
      identityNumber: 123456,
      password: userService.encryptPassword('admin'),
      role: 1,
    });
    exit()

    return new Promise(1)
  } catch (err) {
    console.log(err);
    exit()
  }
}

function exit() {
  mongoose.disconnect();
  process.exit()
}

runSeed()