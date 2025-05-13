/**
 * This script seeds the User collection in the MongoDB database.
 * It can be run as a standalone script or imported as a module.
 */

const User = require("../models/user");
const bcrypt = require("bcrypt-nodejs");
const mongoose = require("mongoose");
const db = require("../db");

const users = [
  new User({
    type: "project_manager",
    email: "pm@pm.com",
    password: bcrypt.hashSync("pm1234", bcrypt.genSaltSync(5), null),
    name: "Project manager",
    dateOfBirth: new Date("1990-05-20"),
    contactNumber: "0333-1234567",
  }),
  new User({
    type: "accounts_manager",
    email: "am@am.com",
    password: bcrypt.hashSync("am1234", bcrypt.genSaltSync(5), null),
    name: "Accounts Manager",
    dateOfBirth: new Date("1990-08-26"),
    contactNumber: "0300-5432011",
  }),
  new User({
    type: "employee",
    email: "employee1@employee.com",
    password: bcrypt.hashSync("123456", bcrypt.genSaltSync(5), null),
    name: "Employee One",
    dateOfBirth: new Date("1994-06-26"),
    contactNumber: "0322-5432011",
  }),
  new User({
    type: "employee",
    email: "employee2@employee.com",
    password: bcrypt.hashSync("123456", bcrypt.genSaltSync(5), null),
    name: "Employee Two",
    dateOfBirth: new Date("1996-05-26"),
    contactNumber: "0311-5432011",
  }),
  new User({
    type: "admin",
    email: "admin@admin.com",
    password: bcrypt.hashSync("admin123", bcrypt.genSaltSync(5), null),
    name: "Admin Admin",
    dateOfBirth: new Date("1980-05-26"),
    contactNumber: "0333-5432011",
  }),
];

/**
 * Seeds the database with predefined users.
 */
const seedUsers = async (closeConn = true) => {
  try {
    console.log("Connecting to the database...");
    await db.connect();
    console.log("Database connected.");

    for (let user of users) {
      const existingUser = await User.findOne({ email: user.email });
      if (existingUser) {
        console.log(`User with email ${user.email} already exists.`);
      } else {
        await user.save();
        console.log(`User with email ${user.email} added.`);
      }
    }

    console.log("All users seeded successfully.");
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  } finally {
    if (closeConn) {
      await mongoose.disconnect();
      console.log("Database connection closed.");
    }
  }
};

// Export the function for use in other scripts
module.exports = seedUsers;

// If the script is run directly, execute the seeding process
if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log("Seeding completed successfully.");
      process.exit(0); // Exit with success
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1); // Exit with failure
    });
}