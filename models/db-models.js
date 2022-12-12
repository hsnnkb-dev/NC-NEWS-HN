const db = require('../db/connection');

exports.selectTopics = () => {
  const queryString = `SELECT * FROM topics`;
  return db.query(queryString).then(({ rows }) => rows)
}