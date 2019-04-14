const express = require( 'express');
import { userRouter } from './resources/user/user.router';

export const restRouter = express.Router();
restRouter.use('/users', userRouter);
