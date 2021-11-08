var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'chamod1998@CSE',  //change this to local machine's password
  database: 'roster'
})

connection.connect();

module.exports = connection;