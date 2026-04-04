const mongoose = require("mongoose");

const equipmentRequestSchema = new mongoose.Schema({
  equipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipment"
  },
  universityId: String,
  status: {
    type: String,
    default: "pending" // pending | approved | rejected
  },
  requestedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("EquipmentRequest", equipmentRequestSchema);
