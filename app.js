/**
 * This script sets up the Express application. It imports necessary modules, sets up middleware,
 * connects to the database, and imports routes.
 *
 * The Express application is then exported and can be used by other scripts (like www).
 *
 */

const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const favicon = require("serve-favicon");

const index = require("./routes/index");
const admin = require("./routes/admin");
const employee = require("./routes/employee");
const manager = require("./routes/manager");
const db = require("./db");

expressValidator = require("express-validator");

// Import the Passport configuration.
// This module configures Passport's strategies and sets up serialization and deserialization rules.
require("./config/passport.js");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// Use the morgan middleware for logging HTTP requests.
// 'dev' format is used, which means the log will include method, url, status, response time and content length.
app.use(logger("dev"));

//json() function parses incoming requests with JSON payloads.
app.use(bodyParser.json());
// urlencoded() function parses incoming requests with URL-encoded payloads.
app.use(bodyParser.urlencoded({ extended: false }));
// express-validator middleware validates and sanitize request data.
//validator should be after body parser
app.use(expressValidator());
// parses Cookie header and populate req.cookies with an object keyed by the cookie names.
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

// Use the express-session middleware to handle session state.
// The 'secret' is used to sign the session ID cookie.
// 'resave: false' means the session store will not be resaved into the session store if it hasn't changed.
// 'saveUninitialized: false' means the session will not be stored in the session store if it's new and not modified.
// 'store' is used to configure the session store. Here, a new instance of MongoStore is created to store session state in MongoDB.
// 'mongooseConnection: mongoose.connection' tells MongoStore to use the existing Mongoose connection.
// 'cookie: { maxAge: 180 * 60 * 1000 }' sets the maximum age of the session cookie to 180 minutes.
app.use(
  session({
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: db.getConnection().getClient(),
    }),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);

// connect-flash middleware provides flash messages, which are stored in the session until they are displayed and deleted.
// Flash messages are often used to show one-time notifications to the user.
app.use(flash());
// This is required to set up Passport's persistent login sessions.
// It must be used before any routes that need to authenticate users.
app.use(passport.initialize());
app.use(passport.session());

// Set up routing for the application.
// The first argument to app.use() is the base path for the routes defined in the provided router.
// The second argument is the router object.
// For example, app.use("/admin", admin) means that the routes defined in the 'admin' router will be used for any path that starts with '/admin'.
app.use("/", index);
app.use("/admin", admin);
app.use("/manager", manager);
app.use("/employee", employee);

app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  res.locals.messages = req.flash();
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
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
