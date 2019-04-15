const Joi = require( 'joi');
const bcrypt = require('bcryptjs');

const encryptPassword = (palinText) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(palinText, salt);
}

const comparePassword = (plainText, encrypedPassword) => {
  return bcrypt.compareSync(plainText, encrypedPassword);
}

const validateUser = (body) => {
  const schema = Joi.object().keys({
    userName: Joi.string().required(),
    accountNumber: Joi.number().required().integer(),
    emailAddress: Joi.string()
      .email()
      .required(),
    identityNumber: Joi.number().required().integer(),
    password: Joi.string().required(),
    role: Joi.number().integer(),
  });
  const { value, error } = Joi.validate(body, schema);
  if (error && error.details) {
    return { error };
  }
  return { value };
}

const validateUserUpdate = (body) => {
  const schema = Joi.object().keys({
    userName: Joi.string().required(),
    accountNumber: Joi.number().required().integer(),
    emailAddress: Joi.string()
      .email()
      .required(),
    identityNumber: Joi.number().required().integer(),
    password: Joi.string(),
    role: Joi.number().integer(),
  });
  const { value, error } = Joi.validate(body, schema);
  if (error && error.details) {
    return { error };
  }
  return { value };
}

const validateLogin = (body) => {
  const schema = Joi.object().keys({
    emailAddress: Joi.string()
      .email()
      .required(),
    password: Joi.string().required(),
  });
  const { value, error } = Joi.validate(body, schema);
  if (error && error.details) {
    return { error };
  }
  return { value };
}

module.exports = {
  encryptPassword,
  comparePassword,
  validateUser,
  validateUserUpdate,
  validateLogin
};