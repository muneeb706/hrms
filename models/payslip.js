var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PaySlipSchema = new Schema({
  accountManagerID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  employeeID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bankName: { type: String, required: true },
  branchAddress: { type: String, required: true },
  basicPay: { type: Number, required: true },
  overtime: { type: Number, default: 0 },
  conveyanceAllowance: { type: Number, default: 0 },
});

module.exports = mongoose.model("PaySlip", PaySlipSchema);
