const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({
  name: String,
  sport: String,
  message: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Invite", inviteSchema);