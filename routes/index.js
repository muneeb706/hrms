const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const { isLoggedIn } = require("./middleware");
const csrf = require("csurf");
const csrfProtection = csrf();
router.use(csrfProtection);

router.get("/", function viewLoginPage(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/check-type");
  }

  const messages = req.flash("error");

  res.render("login", {
    title: "Log In",
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
  });
});

router.post(
  "/login",
  passport.authenticate("local.signin", {
    successRedirect: "/check-type",
    failureRedirect: "/",
    failureFlash: true,
  })
);

router.get("/check-type", function checkTypeOfLoggedInUser(req, res, next) {
  req.session.user = req.user;
  switch (req.user.type) {
    case "project_manager":
    case "accounts_manager":
      res.redirect("/manager/");
      break;
    case "employee":
      res.redirect("/employee/");
      break;
    default:
      res.redirect("/admin/");
  }
});

router.get("/logout", isLoggedIn, function logoutUser(req, res, next) {
  req.logout();
  res.redirect("/");
});

router.get("/signup", function signUp(req, res, next) {
  const messages = req.flash("error");
  res.render("signup", {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
  });
});

router.post(
  "/signup",
  passport.authenticate("local.signup", {
    successRedirect: "/signup",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

router.get("/dummy", async function (req, res, next) {
  try {
    const users = await User.find({ type: "employee" });
    res.render("dummy", { title: "Dummy", users });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
