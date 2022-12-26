const { getTopics, postTopic } = require('../controllers/endpoint-controllers');
const topicsRouter = require('express').Router();

topicsRouter
  .route('/')
  .get(getTopics)
  .post(postTopic);

module.exports = topicsRouter;