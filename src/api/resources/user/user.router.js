const express = require('express');
const passport = require('passport');
import userController from './user.controller';
import { isAdmin } from '../../middlewares/is-admin';

export const userRouter = express.Router();
// 1.authenticated user can get data profile
// 2.an admin can create, update, and delete user

userRouter.post('/signup', userController.signup);
userRouter.post('/login', userController.login);
userRouter.get('/me', passport.authenticate('jwt', { session: false }), userController.authenticate);

const adminPolicy = [passport.authenticate('jwt', { session: false }), isAdmin];
userRouter
  .route('/list')
  .get(adminPolicy, userController.findAll);
userRouter
  .route('/create')
  .post(adminPolicy, userController.createUser);

userRouter
  .route('/:id')
  .get(adminPolicy, userController.findOne)
  .delete(adminPolicy, userController.deleteUser)
  .put(adminPolicy, userController.updateUser);

userRouter
  .route('/account/:number')
  .get(adminPolicy, userController.findOneByAccountNumber);

userRouter
  .route('/identity/:number')
  .get(adminPolicy, userController.findOneByIdentityNumber);