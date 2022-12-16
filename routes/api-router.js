const apiRouter = require('express').Router();
const { getEndpointInfo } = require('../controllers/endpoint-controllers');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');

apiRouter
  .route('/')
  .get(getEndpointInfo);

apiRouter.use('/topics', topicsRouter)
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;