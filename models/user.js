var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
require("mongoose-type-email");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  type: { type: String },
  email: { type: mongoose.SchemaTypes.Email, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  contactNumber: { type: String, required: true },
  department: String,
  Skills: [String],
  designation: String,
  dateAdded: { type: Date },
});

UserSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model("User", UserSchema);
