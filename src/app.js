const express = require('express');
import logger from 'morgan';
import { connect } from './config/db';

const app = express();
const PORT = process.env.PORT || 3000;

connect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

app.listen(PORT, () => {
  console.log(`Server is running at PORT http://localhost:${PORT}`);
});