const { selectTopics } = require('../models/db-models');

exports.getTopics = (request, response, next) => {
  selectTopics().then(topicData => {
    response.send({ topics: topicData })
  });
}