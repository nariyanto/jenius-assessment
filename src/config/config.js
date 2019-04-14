const config = {
  production: {
    secret: process.env.secret,
    MONGO_URI: process.env.MONGO_URI,
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