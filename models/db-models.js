const db = require('../db/connection');

exports.selectTopics = () => {
  const queryString = `SELECT * FROM topics`;
  return db.query(queryString).then(({ rows }) => rows)
}

exports.selectArticles = (topic = 'all', sortBy = 'created_at', orderBy = 'desc') => {
  validTopics = ['mitch', 'cats', 'paper', 'cooking', 'coding', 'football'];
  validSortByColumns = ['title', 'topic', 'author', 'body', 'created_at', 'votes']
  let queryString = `
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count
    FROM articles
    LEFT OUTER JOIN comments on articles.article_id = comments.article_id
  `;

  // Checks if the queries are valid, passes status 400 for Bad Request if any are invalid
  const isTopicValid = validTopics.includes(topic) || topic === 'all'; 
  const isSortyByValid = validSortByColumns.includes(sortBy);
  const isOrderByValid = (orderBy === 'asc' || orderBy === 'desc');
  if (!isTopicValid || !isSortyByValid || !isOrderByValid) {
    return Promise.reject({ status : 400, message: 'Bad Request' });
  }

  // Build up the queryString after passing query validity
  if (topic !== 'all') { queryString += ` WHERE articles.topic = '${topic}'` }
  queryString += ` 
    GROUP BY articles.article_id
    ORDER BY articles.${sortBy}
  `;
  (orderBy === 'asc') ? queryString += ` ASC` : queryString += ` DESC`; 

  return db.query(queryString).then(({ rows }) => rows);
}

exports.selectArticleById = (articleId) => {
  const queryString =  `
    SELECT articles.author, title, articles.article_id, articles.body, topic, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count 
    FROM articles
    LEFT OUTER JOIN comments 
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
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

exports.removeCommentById = (commentId) => {
  const queryString = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *
  `
  return db.query(queryString, [commentId]).then(({ rowCount }) => {
    if (!rowCount) return Promise.reject({ status: 404, message: 'Not Found' });
  });
}

exports.selectUserById = (username) => {
  const queryString = `
    SELECT * FROM users
    WHERE username = $1
  `
  return db.query(queryString, [username]).then(({ rows }) => {
    return (!rows[0]) ? Promise.reject({status: 400, message: 'Bad Request'}) : rows
  });
}

exports.updateCommentVote = (commentId, increaseVote) => {
  const queryString = `
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *
  `
  return db.query(queryString, [increaseVote, commentId]).then(({ rows }) => {
    return (!rows[0]) ? Promise.reject({status: 404, message: 'Not Found'}) : rows 
  })
}