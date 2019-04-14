import userService from './user.service.js';
import User, { USER_ROLE } from './user.model';
import jwt from '../../helpers/jwt';

export default {
  async signup(req, res) {
    try {
      const { value, error } = userService.validateSignup(req.body);
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
      return res.json({ 
        status: 'success',
        message: 'Singup success.',
        data: user
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async login(req, res) {
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
      return res.status(500).send(err);
    }
  },
  authenticate(req, res) {
    return res.json(req.user);
  },
};