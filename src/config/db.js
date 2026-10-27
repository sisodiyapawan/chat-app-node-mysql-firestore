const knex = require('knex');
const config = require('../../knexfile');

const db = knex(config);

async function connectDB() {
    await db.raw('SELECT 1');
    await db.migrate.latest();
    console.log('Connected to MySQL');
}

module.exports = db;
module.exports.connectDB = connectDB;