const { getArticles, getArticleById, patchArticleVote, getCommentsByArticleId, postCommentByArticleId } = require('../controllers/endpoint-controllers');
const articlesRouter = require('express').Router();

articlesRouter
  .route('/')
  .get(getArticles)

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleVote)

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)

module.exports = articlesRouter;

