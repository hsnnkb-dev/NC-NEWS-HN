const { selectTopics, selectArticles } = require('../models/db-models');

exports.getTopics = (request, response, next) => {
  selectTopics().then(topicData => {
    response.send({ topics: topicData })
  })
  .catch(next);
}

exports.getArticles = (request, response, next) => {
  selectArticles().then(articlesData => {
    response.status(200).send({ articles: articlesData })
  })
  .catch(next);
}