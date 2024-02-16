var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSalarySchema = new Schema({
  accountManagerID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  employeeID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  salary: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
  reasonForBonus: { type: String, default: "N/A" },
});

module.exports = mongoose.model("UserSalary", UserSalarySchema);
