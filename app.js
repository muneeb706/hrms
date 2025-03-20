/**
 * This script sets up the Express application. It imports necessary modules, sets up middleware,
 * connects to the database, and imports routes.
 *
 * The Express application is then exported and can be used by other scripts (like www).
 *
 */

require('dotenv').config();

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

// Thêm middleware xử lý session trước khi định tuyến
app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  res.locals.messages = req.flash();
  // Thêm user vào locals để có thể truy cập từ views
  res.locals.user = req.user;
  next();
});

// Set up routing for the application
app.use("/", index);
app.use("/admin", admin);
app.use("/manager", manager);
app.use("/employee", employee);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Xử lý các loại lỗi khác nhau
  if (err.name === "UnauthorizedError") {
    req.flash("error", "Bạn không có quyền truy cập trang này");
    return res.redirect("/");
  }

  // Xử lý lỗi TypeError (không thể đọc thuộc tính của undefined)
  if (err instanceof TypeError && err.message.includes("Cannot read properties of undefined")) {
    req.flash("error", "Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
    return res.redirect("/");
  }

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Thêm middleware bảo mật
app.use(function(req, res, next) {
  // Thêm các header bảo mật
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});

module.exports = app;
