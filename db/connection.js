const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "your_password",
  database: "employeeTracker_db"
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the employeeTracker_db database.");
});

module.exports = connection;