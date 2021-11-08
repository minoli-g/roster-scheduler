var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  //change this to local machine's password
  database: 'scheduler_test'
})

connection.connect();

module.exports = connection;