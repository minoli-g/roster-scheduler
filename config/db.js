var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'roster.mysql.database.azure.com',
  user: 'rosteradmin@roster',
  password: 'Heroku34',  //change this to local machine's password
  database: 'roster'
})

connection.connect();

module.exports = connection;