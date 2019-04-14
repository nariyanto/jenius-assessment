const mongoose = require('mongoose');
const { getConfig } = require('./config');

const config = getConfig(process.env.NODE_ENV);
mongoose.Promise = global.Promise;
export const connect = () => mongoose.connect(config.MONGO_URI, { useNewUrlParser: true });