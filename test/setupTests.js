const db = require("../db");
const request = require("supertest");
const cheerio = require("cheerio");
const execSync = require("child_process").execSync;

global.admin_agent = null;
global.employee_agent = null;
global.pm_agent = null;
global.csrfToken = null;

module.exports = async () => {
  await db.connect().then(() => {
    execSync("NODE_ENV=test node seed/user-seeder.js");
    const app = require("../app");
    admin_agent = request.agent(app);
    employee_agent = request.agent(app);
    pm_agent = request.agent(app);
    csrfToken = null;
  });

  await loginAs(admin_agent, "admin@admin.com", "admin123");
  await loginAs(employee_agent, "employee1@employee.com", "123456");
  await loginAs(pm_agent, "pm@pm.com", "pm1234");
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
