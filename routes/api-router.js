const apiRouter = require('express').Router();
const { getEndpointInfo } = require('../controllers/endpoint-controllers');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');

/*
 *  Main Routing logic for all endpoints.
 *  Handles routing for each of the available endpoints (e.g. '/articles').
 *  Each of the endpoints handle their own sub-routes (e.g. '/:article_id').
 *  Also, handles information delivery for the API. 
*/

apiRouter
  .route('/')
  .get(getEndpointInfo);

apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;