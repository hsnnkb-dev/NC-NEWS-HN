const { selectTopics } = require('../models/db-models');

exports.getTopics = (request, response, next) => {
  selectTopics();
}