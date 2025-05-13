const db = require("../db");
const request = require("supertest");
const cheerio = require("cheerio");
const execSync = require("child_process").execSync;

global.admin_agent = null;
global.employee_agent = null;
global.pm_agent = null;
global.csrfToken = null;

module.exports = async () => {
  try {
    console.log("Connecting to the database...");
    await db.connect();
    console.log("Database connected. Seeding data...");
    execSync("NODE_ENV=test node seed/user-seeder.js");
    console.log("Data seeded. Initializing agents...");

    const app = require("../app");
    admin_agent = request.agent(app);
    employee_agent = request.agent(app);
    pm_agent = request.agent(app);

    await loginAs(admin_agent, "admin@admin.com", "admin123");
    await loginAs(employee_agent, "employee1@employee.com", "123456");
    await loginAs(pm_agent, "pm@pm.com", "pm1234");

    console.log("Test setup completed successfully.");
  } catch (error) {
    console.error("Error during test setup:", error);
    process.exit(1);
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
