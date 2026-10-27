const db = require('../config/db');

function insert(user) {
  return db('users').insert(user);
}

function findById(id) {
  return db('users')
    .where({ id })
    .first();
}

module.exports = { insert, findById };
