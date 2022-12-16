const { deleteCommentById, patchCommentVote } = require('../controllers/endpoint-controllers');
const commentsRouter = require('express').Router();

commentsRouter
  .route('/:comment_id')
  .delete(deleteCommentById)
  .patch(patchCommentVote)

module.exports = commentsRouter;