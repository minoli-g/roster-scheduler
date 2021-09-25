const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();


const admin = require('./routes/AdminRoute');
app.use('/', admin);





const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listning on port ${port}...`)
});





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// setting up session data storage
const session=require("express-session");
const MySQLStore=require('express-mysql-session')(session);

const connection = require('./config/db');
const sessionStore = new MySQLStore({}/* session store options */, connection);

app.use(session({
	key: 'session_cookie_name',
	secret: 'session_cookie_secret',
	store: sessionStore,
	resave: false,
	saveUninitialized: true,
  cookie: { maxAge: 10 * 24 * 60 * 60 * 1000 }
}));

//Points to the index file of the routes folder, to guide to all routes.
app.use(require('./routes'));


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Connecting the Database
connection.connect((err) => {
  console.log('Mysql Connected...');
});


// app.get('/details', (req, res) => {
//   let sql = 'SELECT first_name FROM user';
//   connection.query(sql, (err, result) => {
//       console.log("Data fetched...");
//       res.send(result);
//   });
// });













// module.exports = app;
