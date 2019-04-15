const jwt = require('../../helpers/jwt');
const userService = require('./user.service.js');
import User, { USER_ROLE } from './user.model';
import { client } from '../../../config/redis';

const signup = async (req, res) => {
  try {
    const { value, error } = userService.validateUser(req.body);
    if (error) {
      return res.status(422).json({
        status: 'error',
        message: 'Invalid request data',
        error: error.message
      });
    }
    const encryptedPass = userService.encryptPassword(value.password);

    const user = await User.create({
      userName: value.userName,
      accountNumber: value.accountNumber,
      emailAddress: value.emailAddress,
      identityNumber: value.identityNumber,
      password: encryptedPass,
      role: value.role || USER_ROLE,
    });

    client.setex('user/'+user.id, 3600, JSON.stringify(user));
    client.setex('account/'+user.accountNumber, 3600, JSON.stringify(user));
    client.setex('identity/'+user.identityNumber, 3600, JSON.stringify(user));

    return res.json({ 
      status: 'success',
      message: 'Singup success.',
      data: user
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: 'error',
      message: 'Whoops!!!',
      error: err
    });
  }
}

const login = async (req, res) => {
  try {
    const { value, error } = userService.validateLogin(req.body);
    if (error) {
      return res.status(422).json({
        status: 'error',
        message: 'Invalid request data',
        error: error.message
      });
    }
    const user = await User.findOne({ emailAddress: value.emailAddress });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Email not found',
        error: 'unauthorized'
      });
    }
    const authenticted = userService.comparePassword(value.password, user.password);
    if (!authenticted) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid password',
        error: 'unauthorized'
      });
    }
    const token = jwt.issue({ id: user._id }, '1d');
    return res.json({
      status: 'success',
      message: 'Login success',
      data: {
        token: token
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: 'error',
      message: 'Whoops!!!',
      error: err
    });
  }
}

function authenticate(req, res) {
  return res.json(req.user);
}

// CRUD Section
const createUser = async (req, res) => {
  try {
    const { value, error } = userService.validateUser(req.body);
    if (error) {
      return res.status(422).json({
        status: 'error',
        message: 'Invalid request data',
        error: error.message
      });
    }
    const encryptedPass = userService.encryptPassword(value.password);

    const user = await User.create({
      userName: value.userName,
      accountNumber: value.accountNumber,
      emailAddress: value.emailAddress,
      identityNumber: value.identityNumber,
      password: encryptedPass,
      role: value.role || USER_ROLE,
    });

    client.setex('user/'+user.id, 3600, JSON.stringify(user));
    client.setex('account/'+user.accountNumber, 3600, JSON.stringify(user));
    client.setex('identity/'+user.identityNumber, 3600, JSON.stringify(user));

    return res.json({ 
      status: 'success',
      message: 'Create user success.',
      data: user
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: 'error',
      message: 'Whoops!!!',
      error: err
    });
  }
}

const findAll = async (req, res) => {
  try {
    const { page, perPage } = req.query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perPage, 10) || 10,
      populate: {
        path: 'user',
        select: 'userName accountNumber emailAddress identityNumber',
      },
    };
    const users = await User.paginate({}, options);
    return res.json({ 
      status: 'success',
      message: 'Get list users.',
      data: users
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: 'error',
      message: 'Whoops!!!',
      error: err
    });
  }
}

const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    client.get('user/'+id, async (error, user) => { 
      if (error) {
        throw error;
      }
      
      if (!user) {
        user = await User.findById(id).populate('user', 'userName accountNumber emailAddress identityNumber');
        if (user) {
          user = user.toJSON()
          client.setex('user/'+id, 3600, JSON.stringify(user));
        }
      }
      
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'Could not find user'
        });
      }
      return res.json({ 
        status: 'success',
        message: 'Get user.',
        data: JSON.parse(user)
      });
    });
    
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: 'error',
      message: 'Whoops!!!',
      error: err
    });
  }
}

const findOneByAccountNumber = async (req, res) => {
  try {
    const { number } = req.params
    client.get('account/'+number, async (error, user) => { 

      if (error) {
        throw error;
      }
      
      if (!user) {
        user = await User.find({accountNumber: number}).populate('user', 'userName accountNumber emailAddress identityNumber');
        if (Object.keys(user).length > 0) {
          client.setex('account/'+number, 3600, JSON.stringify(user));
        }
      } else {
        user = JSON.parse(user)
      }

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'Could not find user'
        });
      }
      return res.json({ 
        status: 'success',
        message: 'Get user.',
        data: user
      });
    })
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: 'error',
      message: 'Whoops!!!',
      error: err
    });
  }
}

const findOneByIdentityNumber = async (req, res) => {
  try {
    const { number } = req.params
    client.get('identity/'+number, async (error, user) => { 

      if (error) {
        throw error;
      }

      if (!user) {
        user = await User.find({identityNumber: number}).populate('user', 'userName accountNumber emailAddress identityNumber');
        if (Object.keys(user).length > 0) {
          client.setex('identity/'+number, 3600, JSON.stringify(user));
        }
      } else {
        user = JSON.parse(user)
      }
      
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'Could not find user'
        });
      }
      return res.json({ 
        status: 'success',
        message: 'Get user.',
        data: user
      });
    })
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: 'error',
      message: 'Whoops!!!',
      error: err
    });
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOneAndRemove({ _id: id });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Could not find user'
      });
    }

    client.del('user/'+user.id);
    client.del('account/'+user.accountNumber);
    client.del('identity/'+user.identityNumber);

    return res.json({ 
      status: 'success',
      message: 'User has been deleted.'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: 'error',
      message: 'Whoops!!!',
      error: err
    });
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    let reqBody = req.body;
    if (reqBody.password == undefined || reqBody.password == '') {
      delete reqBody.password
    }
    const { value, error } = userService.validateUserUpdate(reqBody);
    if (error) {
      return res.status(422).json({
        status: 'error',
        message: 'Invalid request data',
        error: error.message
      });
    }
    
    const user = await User.findOneAndUpdate({ _id: id }, value, { runValidators: true, context: 'query' });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Could not find user'
      });
    }

    client.setex('user/'+id, 3600, JSON.stringify(user));
    client.setex('account/'+user.accountNumber, 3600, JSON.stringify(user));
    client.setex('identity/'+user.identityNumber, 3600, JSON.stringify(user));

    return res.json({ 
      status: 'success',
      message: 'Get list users.',
      data: user
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: 'error',
      message: 'Whoops!!!',
      error: err
    });
  }
}

module.exports = {
  signup,
  login,
  authenticate,

  createUser,
  findAll,
  findOne,
  findOneByAccountNumber,
  findOneByIdentityNumber,
  deleteUser,
  updateUser
};