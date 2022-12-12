const { selectTopics, selectArticles, selectArticleById } = require('../models/db-models');

exports.getTopics = (request, response, next) => {
  selectTopics().then(topicData => {
    response.status(200).send({ topics: topicData })
  })
  .catch(next);
}

exports.getArticles = (request, response, next) => {
  selectArticles().then(articlesData => {
    response.status(200).send({ articles: articlesData })
  })
  .catch(next);
}

exports.getArticleById = (request, response, next) => {
  const { article_id: articleId } = request.params;
  selectArticleById(articleId).then(articleData => {
    response.status(200).send({ article : articleData })
  })
  .catch(next)
}