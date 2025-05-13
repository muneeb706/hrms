const execSync = require("child_process").execSync;

module.exports = async () => {
  try {
    execSync("NODE_ENV=test node seed/user-seeder.js");
    console.log("Database seeded")
  } catch (error) {
    console.error("Setup failed:", error);
    throw error;
  }
};