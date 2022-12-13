const db = require('../db/connection')

exports.checkArticleIdExists = (articleId) => {
  const queryString = `SELECT * FROM articles WHERE article_id = $1`
  return db.query(queryString, [articleId]).then(({ rowCount }) => (!rowCount) ? Promise.reject() : true)
}