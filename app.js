const express = require('express');
const { 
  getTopics, 
  getArticles, 
  getArticleById, 
  getCommentsByArticleId, 
  postCommentByArticleId,
  patchArticleVote,
  getUsers,
  deleteCommentById,
  getEndpointInfo
} = require('./controllers/endpoint-controllers');
const { 
  handleServerErrors, 
  handle404Errors, 
  handlePsqlErrors, 
  handleCustomErrors 
} = require('./controllers/error-controllers')

const app = express();
app.use(express.json());

/* ENDPOINTS */
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postCommentByArticleId);
app.patch('/api/articles/:article_id', patchArticleVote);
app.get('/api/users', getUsers);
app.delete('/api/comments/:comment_id', deleteCommentById);
app.get('/api', getEndpointInfo)

/* ERROR-HANDLING */
app.all('*', handle404Errors);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;