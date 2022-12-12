const express = require('express');
const { getTopics } = require('./controllers/endpoint-controllers');
const { handleServerErrors } = require('./controllers/error-controllers')

const app = express();
app.get('/api/topics', getTopics);

app.use(handleServerErrors)

module.exports = app;