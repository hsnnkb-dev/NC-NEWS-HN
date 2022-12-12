const express = require('express');
const { getTopics, getArticles, getArticleById } = require('./controllers/endpoint-controllers');
const { handleServerErrors, handle404Errors, handlePsqlErrors } = require('./controllers/error-controllers')

const app = express();
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);

app.all('*', handle404Errors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;