var mysql = require("mysql");

// const db_config = {
//   host: "us-cdbr-east-04.cleardb.com",
//   user: "b654e8927ee26b",
//   password: "090cb62d", //change this to local machine's password
//   database: "heroku_8a6f7a873a84775",
// };

// const db_config = {
//   host: "localhost",
//   user: "root",
//   password: "", //change this to local machine's password
//   database: "scheduler_test",
// };

const db_config = {
  host: "localhost",
  user: "root",
  password: "", //change this to local machine's password
  database: "roster",
};
var connection;

function handleDisconnect() {
  connection = mysql.createPool(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  // connection.connect(function(err) {              // The server is either down
  //   if(err) {                                     // or restarting (takes a while sometimes).
  //     console.log('error when connecting to db:', err);
  //     setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
  //   }                                     // to avoid a hot loop, and to allow our node script to
  // });                                     // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}

handleDisconnect();

module.exports = connection;
