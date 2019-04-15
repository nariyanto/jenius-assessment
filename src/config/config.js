const config = {
  production: {
    secret: process.env.SECRET_KEY,
    MONGO_URI: process.env.MONGODB_URI,
    port: process.env.PORT,
  },
  development: {
    secret: 'I_AME_GERER',
    MONGO_URI: 'mongodb://localhost/septiyanapp',
    port: 3000,
  },
};

const getConfig = env => config[env] || config.development;

module.exports = {
  getConfig
}