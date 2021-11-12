var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var app = express();
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/env/.env.dev" });
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// setting up session data storage
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

var connection = require("./config/db");
var sessionStore = new MySQLStore({} /* session store options */, connection);

app.use(
  session({
    key: "session_cookie_name",
    secret: "session_cookie_secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 10 * 24 * 60 * 60 * 1000 },
  })
);

var whitelist = [
  process.env.FRONTEND_BASE_URL,
  undefined,
  process.env.API_BASE_URL,
];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "*",
  credentials: true,
};

// Then pass them to cors:
app.use(cors(corsOptions));
//Points to the index file of the routes folder, to guide to all routes.
app.use(require("./routes"));

// app.use("/doctor/", require("./routes/doctorRoutes"))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
