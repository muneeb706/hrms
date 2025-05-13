// setupTests.js
const db = require("../db");
const request = require("supertest");
const cheerio = require("cheerio");
const execSync = require("child_process").execSync;

global.admin_agent = null;
global.csrfToken = null;
global.app = null;

module.exports = async () => {
  try {
    await db.connect();
    console.log("Database connected");

    execSync("NODE_ENV=test node seed/user-seeder.js");
    console.log("Database seeded");

    global.app = require("../app");
    global.admin_agent = request.agent(app);
    global.csrfToken = null;
    console.log("Agents created");

    await loginAs(global.admin_agent, "admin@admin.com", "admin123");
    console.log("Admin logged in");
  } catch (error) {
    console.error("Setup failed:", error);
    throw error;
  }
};

async function loginAs(agent, email, password) {
  const getRes = await agent.get("/");
  const $ = cheerio.load(getRes.text);
  const csrfToken = $('input[name="_csrf"]').val();

  await agent.post("/login").send({
    _csrf: csrfToken,
    email: email,
    password: password,
  });

  return agent;
}