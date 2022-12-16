const { deleteCommentById } = require('../controllers/endpoint-controllers');
const commentsRouter = require('express').Router();

commentsRouter
  .route('/:comment_id')
  .delete(deleteCommentById)

module.exports = commentsRouter;