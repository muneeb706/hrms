const db = require('../db');
const app = require('../app');
const request = require('supertest');
const execSync = require('child_process').execSync;

global.agent = request.agent(app);

module.exports = async () => {
  await db.connect().then(() => {
    execSync("NODE_ENV=test node seed/user-seeder.js");
  })

};