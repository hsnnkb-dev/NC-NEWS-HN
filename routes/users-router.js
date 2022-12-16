const { getUsers, getUserById } = require('../controllers/endpoint-controllers');
const usersRouter = require('express').Router();

usersRouter
  .route('/')
  .get(getUsers)

usersRouter
  .route('/:username')
  .get(getUserById)
module.exports = usersRouter;