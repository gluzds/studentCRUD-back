const mysql = require("mysql2");

let db = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'root',
  database: 'delta'
});

module.exports = db;
