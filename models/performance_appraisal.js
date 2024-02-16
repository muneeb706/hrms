var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PerformanceAppraisalSchema = new Schema({
  projectManagerID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  employeeID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  positionExpertise: [String],
  approachTowardsQualityOfWork: String,
  approachTowardsQuantityOfWork: String,
  leadershipManagementSkills: { type: String, required: true },
  communicationSkills: { type: String, required: true },
  commentsOnOverallPerformance: { type: String, required: true },
});

module.exports = mongoose.model(
  "PerformanceAppraisal",
  PerformanceAppraisalSchema
);
