/**
 * This script seeds the User collection in the MongoDB database.
 *
 * It first connects to the MongoDB database using Mongoose.
 * Then, it creates an array of new User instances with predefined data.
 * Each User instance represents a document that will be inserted into the User collection.
 *
 * Each User document has the following fields:
 * - type: The role of the user (e.g., "project_manager", "accounts_manager", "employee").
 * - email: The email address of the user.
 * - password: The hashed password of the user. The password is hashed using bcrypt.
 * - name: The name of the user.
 * - dateOfBirth: The date of birth of the user.
 * - contactNumber: The contact number of the user.
 *
 */

let User = require("../models/user");
let bcrypt = require("bcrypt-nodejs");
let mongoose = require("mongoose");

const db = require("../db");

db.connect()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error", err));

let users = [
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

(async function () {
  for (let user of users) {
    let existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      console.log(`User with email ${user.email} already exists.`);
      break;
    } else {
      await user.save();
    }
  }
  exit();
})();

function exit() {
  mongoose.disconnect();
  console.log("Users Added...")
}
