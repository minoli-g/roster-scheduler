var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'turtles24',  //change this to local machine's password
  database: 'roster'
})

connection.connect();

module.exports = connection;