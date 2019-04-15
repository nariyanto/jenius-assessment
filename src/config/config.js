const config = {
  production: {
    secret: process.env.SECRET_KEY,
    MONGO_URI: process.env.MONGODB_URI,
    REDIS_URL: process.env.REDIS_URL,
    port: process.env.PORT,
  },
  development: {
    secret: 'I_AME_GERER',
    MONGO_URI: process.env.MONGODB_URI || 'mongodb://localhost/septiyanapp',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    port: 3000,
  },
};

const getConfig = env => config[env] || config.development;

module.exports = {
  getConfig
}