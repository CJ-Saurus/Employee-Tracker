const express = require("express");
const mysql = require("mysql");

const app = express();
const PORT = process.env.PORT || 3306;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "WangPerez198679!",
  database: "employee_db",
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`Connected to MySQL database as ID ${connection.threadId}`);
});

module.exports = connection;