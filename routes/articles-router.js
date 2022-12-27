const { getArticles, getArticleById, patchArticleVote, getCommentsByArticleId, postCommentByArticleId, postArticle, deleteArticle } = require('../controllers/endpoint-controllers');
const articlesRouter = require('express').Router();

articlesRouter
  .route('/')
  .get(getArticles)
  .post(postArticle)

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleVote)
  .delete(deleteArticle)

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)

module.exports = articlesRouter;

