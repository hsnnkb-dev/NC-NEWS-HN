const { 
  selectTopics, 
  selectArticles, 
  selectArticleById, 
  selectCommentsByArticleId, 
  insertCommentByArticleId, 
  updateArticleVote, 
  selectUsers,
  removeCommentById,
  selectUserById,
  updateCommentVote,
  addArticle
} = require('../models/db-models');
const { checkArticleIdExists } = require('../models/articles.comments');
const { readEndpoints } = require('../models/file-models');

exports.getTopics = (request, response, next) => {
  selectTopics().then(topicData => {
    response.status(200).send({ topics: topicData })
  })
  .catch(next);
}

exports.getArticles = (request, response, next) => {
  const { topic, sort_by: sortBy, order: orderBy, limit, p: page } = request.query;
  selectArticles(topic, sortBy, orderBy, limit, page)
    .then(articlesData => response.status(200).send({ articles: articlesData, total_count: articlesData.length }))
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
  const { limit, p: page } = request.query;
  const promises = [selectCommentsByArticleId(articleId, limit, page), checkArticleIdExists(articleId)];
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

exports.deleteCommentById = (request, response, next) => {
  const { comment_id : commentId } = request.params;
  removeCommentById(commentId)
    .then(() => response.sendStatus(204))
    .catch(next);
}

exports.getEndpointInfo = (request, response, next) => {
  readEndpoints()
    .then(availableEndpoints => response.status(200).send({ availableEndpoints }))
    .catch(next);
}

exports.getUserById = (request, response, next) => {
  const { username } = request.params;
  selectUserById(username)
    .then((userData) => response.status(200).send({ user: userData }))
    .catch(next)
}

exports.patchCommentVote = (request, response, next) => {
  const { comment_id : commentId } = request.params;
  const { inc_votes : increaseVote } = request.body;
  updateCommentVote(commentId, increaseVote)
    .then((commentData) => response.status(200).send({ updatedComment : commentData }))
    .catch(next);
}

exports.postArticle = (request, response, next) => {
  const { body: articleBody } = request;
  addArticle(articleBody)
    .then(articleData => response.status(201).send({ postedArticle : articleData }))
    .catch(next)
}