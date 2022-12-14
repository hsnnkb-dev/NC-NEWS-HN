const { 
  selectTopics, 
  selectArticles, 
  selectArticleById, 
  selectCommentsByArticleId, 
  insertCommentByArticleId, 
  updateArticleVote, 
  selectUsers 
} = require('../models/db-models');
const { checkArticleIdExists } = require('../models/articles.comments');

exports.getTopics = (request, response, next) => {
  selectTopics().then(topicData => {
    response.status(200).send({ topics: topicData })
  })
  .catch(next);
}

exports.getArticles = (request, response, next) => {
  const { topic, sort_by: sortBy, order: orderBy } = request.query;
  console.log(topic, sortBy, orderBy);
  selectArticles(topic, sortBy, orderBy)
    .then(articlesData => response.status(200).send({ articles: articlesData }))
    .catch(next);
}

exports.getArticleById = (request, response, next) => {
  const { article_id: articleId } = request.params;
  selectArticleById(articleId)
    .then(articleData => response.status(200).send({ article : articleData }))
    .catch(next)
}

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id: articleId } = request.params;
  const promises = [selectCommentsByArticleId(articleId), checkArticleIdExists(articleId)];
  Promise.all(promises)
    .then(([commentsData]) => response.status(200).send({ comments: commentsData }))
    .catch(next)
}

exports.postCommentByArticleId = (request, response, next) => {
  const { body: comment } = request;
  const { article_id: articleId } = request.params;
  insertCommentByArticleId(articleId, comment)
    .then(commentData => response.status(201).send({ postedComment : commentData }))
    .catch(next)
}

exports.patchArticleVote = (request, response, next) => {
  const { inc_votes: increaseVote } = request.body;
  const { article_id: articleId } = request.params;
  updateArticleVote(articleId, increaseVote)
    .then(articleData => response.status(200).send({ upvotedArticle : articleData }))
    .catch(next)
}

exports.getUsers = (request, response, next) => {
  selectUsers()
    .then(users => response.status(200).send({ users: users }))
    .catch(next)
}
