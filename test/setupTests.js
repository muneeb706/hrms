const db = require('../db');
const app = require('../app');
const request = require('supertest');
const cheerio = require("cheerio");
const execSync = require('child_process').execSync;

global.admin_agent = request.agent(app);
global.employee_agent = request.agent(app);
global.csrfToken = null

module.exports = async () => {
  await db.connect().then(() => {
    execSync("NODE_ENV=test node seed/user-seeder.js");
  })

  await loginAs(admin_agent, "admin@admin.com", "admin123")
  await loginAs(employee_agent, "employee1@employee.com", "123456")

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