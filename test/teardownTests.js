const app = require("../app");
const db = require("../db");

module.exports = async () => {
  await admin_agent.get("/logout");
  await employee_agent.get("/logout");
  await pm_agent.get("/logout");

  await db.close();
  // If your app doesn't close the server automatically, you can do it manually
  if (app && app.close) {
    app.close();
  }
};
