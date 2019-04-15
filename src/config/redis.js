const redis = require('redis');
const { getConfig } = require('./config');

const config = getConfig(process.env.NODE_ENV);
export const client = redis.createClient(config.REDIS_URL);