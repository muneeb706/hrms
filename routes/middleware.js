module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Vui lòng đăng nhập để tiếp tục");
  res.redirect("/");
};

module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user && req.user.type === "admin") {
    return next();
  }
  req.flash("error", "Bạn không có quyền truy cập trang này");
  res.redirect("/");
};

module.exports.isProjectManager = (req, res, next) => {
  if (req.isAuthenticated() && req.user && req.user.type === "project_manager") {
    return next();
  }
  req.flash("error", "Bạn không có quyền truy cập trang này");
  res.redirect("/");
};

module.exports.isAccountsManager = (req, res, next) => {
  if (req.isAuthenticated() && req.user && req.user.type === "accounts_manager") {
    return next();
  }
  req.flash("error", "Bạn không có quyền truy cập trang này");
  res.redirect("/");
};

module.exports.isEmployee = (req, res, next) => {
  if (req.isAuthenticated() && req.user && req.user.type === "employee") {
    return next();
  }
  req.flash("error", "Bạn không có quyền truy cập trang này");
  res.redirect("/");
};

module.exports.isManager = (req, res, next) => {
  if (req.isAuthenticated() && req.user && (req.user.type === "project_manager" || req.user.type === "accounts_manager")) {
    return next();
  }
  req.flash("error", "Bạn không có quyền truy cập trang này");
  res.redirect("/");
};
