const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  equipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipment"
  },
  universityId: String,
  assignedAt: {
    type: Date,
    default: Date.now
  },
  returnedAt: Date,
  status: {
    type: String,
    enum: ["assigned", "returned"],
    default: "assigned"
  }
});

module.exports = mongoose.model("Assignment", assignmentSchema);
