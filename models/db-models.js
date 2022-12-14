const db = require('../db/connection');

exports.selectTopics = () => {
  const queryString = `SELECT * FROM topics`;
  return db.query(queryString).then(({ rows }) => rows)
}

exports.selectArticles = () => {
  const queryString = `
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count
    FROM articles
    LEFT OUTER JOIN comments on articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
  `;
  return db.query(queryString).then(({ rows }) => rows);
}

exports.selectArticleById = (articleId) => {
  const queryString =  `
    SELECT * FROM articles
    WHERE article_id = $1
  `
  return db.query(queryString, [articleId]).then(({ rows }) => (!rows[0]) ? Promise.reject() : rows );
}

exports.selectCommentsByArticleId = (articleId) => {
  const queryString = `
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
  `;
  return db.query(queryString, [articleId]).then(({ rows }) => rows);
}

exports.insertCommentByArticleId = (articleId, comment) => {
  const { body, username } = comment;
  const queryString = `
    INSERT INTO comments
      (body, votes, author, article_id)
    VALUES
      ($1, 0, $2, $3)
    RETURNING *
  `
  return db.query(queryString, [body, username, articleId]).then(({ rows }) => rows)
}

exports.updateArticleVote = (articleId, increaseVote) => {
  const queryString = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
  `;
  return db.query(queryString, [increaseVote, articleId]).then(({ rows }) => {
    return (!rows[0]) ? Promise.reject({status: 404, message: 'Not Found'}) : rows;
  });
}

exports.selectUsers = () => {
  const queryString = `SELECT * FROM users`;
  return db.query(queryString).then(({ rows }) => rows)
}
