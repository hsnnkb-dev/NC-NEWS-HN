const { selectTopics, selectArticles, selectArticleById, selectCommentsByArticleId } = require('../models/db-models');
const { checkArticleIdExists } = require('../models/articles.comments');

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

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id: articleId } = request.params;
  const promises = [selectCommentsByArticleId(articleId), checkArticleIdExists(articleId)];
  Promise.all(promises)
  .then(([commentsData]) => response.status(200).send({ comments: commentsData }))
  .catch(next)
}
