const db = require('../db');
const app = require('../app');
const request = require('supertest');
const cheerio = require("cheerio");
const execSync = require('child_process').execSync;

global.agent = request.agent(app);
global.csrfToken = null

module.exports = async () => {
  await db.connect().then(() => {
    execSync("NODE_ENV=test node seed/user-seeder.js");
  })

  const getRes = await agent.get("/");
  const $ = cheerio.load(getRes.text);
  global.csrfToken = $('input[name="_csrf"]').val();

  await agent.post("/login").send({
    _csrf: csrfToken,
    email: "admin@admin.com",
    password: "admin123",
  });

};