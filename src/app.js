const express = require('express');
import { connect } from './config/db';

const app = express();
const PORT = process.env.PORT || 3000;

connect();

app.listen(PORT, () => {
  console.log(`Server is running at PORT http://localhost:${PORT}`);
});