const express = require('express');
const { getTopics, getArticles, getArticleById, getCommentsByArticleId, postCommentByArticleId } = require('./controllers/endpoint-controllers');
const { handleServerErrors, handle404Errors, handlePsqlErrors } = require('./controllers/error-controllers')

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postCommentByArticleId)

app.all('*', handle404Errors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;