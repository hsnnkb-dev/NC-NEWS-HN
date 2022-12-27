const { 
  selectTopics, 
  selectArticles, 
  selectArticleById, 
  selectCommentsByArticleId, 
  addCommentByArticleId, 
  updateArticleVote, 
  selectUsers,
  removeCommentById,
  selectUserById,
  updateCommentVote,
  addArticle,
  addTopic,
  removeArticle
} = require('../models/db-models');
const { checkArticleIdExists } = require('../models/articles.comments');
const { readEndpoints } = require('../models/file-models');

/*
 *  Controller logic for all endpoints.
 *  Handles requests, responses, and passes to middleware
 *  for error-handling. Organised based on CRUD operations.
*/

/* ============== POST controllers ============== */
exports.postArticle = (request, response, next) => {
  const { body: articleBody } = request;
  addArticle(articleBody)
    .then(postedArticle => response.status(201).send({ postedArticle }))
    .catch(next)
}

exports.postCommentByArticleId = (request, response, next) => {
  const { body: comment } = request;
  const { article_id: articleId } = request.params;
  addCommentByArticleId(articleId, comment)
    .then(postedComment => response.status(201).send({ postedComment }))
    .catch(next)
}

exports.postTopic =  (request, response, next) => {
  const { slug, description } = request.body;
  addTopic(slug, description)
    .then(postedTopic => response.status(201).send({ postedTopic }))
    .catch(next)
}


/* ============== GET controllers ============== */
exports.getArticles = (request, response, next) => {
  const { topic, sort_by: sortBy, order: orderBy, limit, p: page } = request.query;
  selectArticles(topic, sortBy, orderBy, limit, page)
    .then(articles => response.status(200).send({ articles, total_count: articles.length }))
    .catch(next);
}

exports.getArticleById = (request, response, next) => {
  const { article_id: articleId } = request.params;
  selectArticleById(articleId)
    .then(article => response.status(200).send({ article }))
    .catch(next)
}

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id: articleId } = request.params;
  const { limit, p: page } = request.query;
  const promises = [selectCommentsByArticleId(articleId, limit, page), checkArticleIdExists(articleId)];
  Promise.all(promises)
    .then(([comments]) => response.status(200).send({ comments }))
    .catch(next)
}

exports.getEndpointInfo = (request, response, next) => {
  readEndpoints()
    .then(availableEndpoints => response.status(200).send({ availableEndpoints }))
    .catch(next);
}

exports.getTopics = (request, response, next) => {
  selectTopics()
    .then(topics => response.status(200).send({ topics }))
    .catch(next);
}

exports.getUsers = (request, response, next) => {
  selectUsers()
    .then(users => response.status(200).send({ users }))
    .catch(next)
}

exports.getUserById = (request, response, next) => {
  const { username } = request.params;
  selectUserById(username)
    .then((user) => response.status(200).send({ user }))
    .catch(next)
}


/* ============== PATCH controllers ============== */
exports.patchArticleVote = (request, response, next) => {
  const { inc_votes: increaseVote } = request.body;
  const { article_id: articleId } = request.params;
  updateArticleVote(articleId, increaseVote)
    .then(updatedArticle => response.status(200).send({ updatedArticle }))
    .catch(next)
}

exports.patchCommentVote = (request, response, next) => {
  const { comment_id : commentId } = request.params;
  const { inc_votes : increaseVote } = request.body;
  updateCommentVote(commentId, increaseVote)
    .then(updatedComment => response.status(200).send({ updatedComment }))
    .catch(next);
}


/* ============== DELETE controllers ============== */
exports.deleteArticle = (request, response, next) => {
  const { article_id: articleId } = request.params;
  removeArticle(articleId)
    .then(() => response.sendStatus(204))
    .catch(next)
}

exports.deleteCommentById = (request, response, next) => {
  const { comment_id : commentId } = request.params;
  removeCommentById(commentId)
    .then(() => response.sendStatus(204))
    .catch(next);
}