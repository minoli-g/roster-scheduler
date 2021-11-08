var mysql = require('mysql')

var connection = mysql.createConnection({
  // host: 'localhost',
  // user: 'root',
  // password: '',  //change this to local machine's password
  // database: 'schedular'
  host: 'us-cdbr-east-04.cleardb.com',
  user: 'b654e8927ee26b',
  password: '090cb62d',  //change this to local machine's password
  database: 'heroku_8a6f7a873a84775'
})

connection.connect();

module.exports = connection;