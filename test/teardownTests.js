const app = require("../app");
const db = require("../db");

module.exports = async () => {
  console.log("Tearing down tests...");
  console.log("Logging out all users...");
  await admin_agent.get("/logout");
  await employee_agent.get("/logout");
  await pm_agent.get("/logout");

  await db.close();
  console.log("Database connection closed.");
  // If your app doesn't close the server automatically, you can do it manually
  if (app && app.close) {
    app.close();
  }
};
