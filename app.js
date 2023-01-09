const express = require('express');
const { 
  handleServerErrors, 
  handle404Errors, 
  handlePsqlErrors, 
  handleCustomErrors 
} = require('./controllers/error-controllers');
const apiRouter = require('./routes/api-router');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

/* ENDPOINT ROUTING */
app.use('/api', apiRouter)

/* ERROR-HANDLING */
app.all('*', handle404Errors);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;