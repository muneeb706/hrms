const db = require("../db");
const request = require("supertest");
const cheerio = require("cheerio");
const seedUsers = require("../seed/user-seeder");

global.admin_agent = null;
global.employee_agent = null;
global.pm_agent = null;

module.exports = async () => {
  try {
    // seedUsers will create connection with db and will not close it
    await seedUsers(closeConn = false);
    
    const app = require("../app");
    global.admin_agent = request.agent(app);
    global.employee_agent = request.agent(app);
    global.pm_agent = request.agent(app);

    console.log(global.admin_agent)

    console.log("Logging in users...");
    await loginAs(admin_agent, "admin@admin.com", "admin123");
    await loginAs(employee_agent, "employee1@employee.com", "123456");
    await loginAs(pm_agent, "pm@pm.com", "pm1234");

    console.log("Test setup completed successfully.");
  } catch (error) {
    console.error("Error during test setup:", error);
    process.exit(1); // Exit with failure
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
