var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  //change this to local machine's password
  database: 'schedular'
})

connection.connect();

module.exports = connection;