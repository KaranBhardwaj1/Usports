const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  sport: String,
  tournament: String,
  teamA: String,
  teamB: String,

  // cricket
 innings: { type: Number, default: 1 }, // 1 or 2

// Team A batting
runsA: { type: Number, default: 0 },
wicketsA: { type: Number, default: 0 },
oversA: { type: Number, default: 0 },

// Team B batting
runsB: { type: Number, default: 0 },
wicketsB: { type: Number, default: 0 },
oversB: { type: Number, default: 0 },

  // football
  scoreA: { type: Number, default: 0 },
  scoreB: { type: Number, default: 0 },

  status: { type: String, default: "Live" }
  
}, { timestamps: true });

module.exports = mongoose.model("Score", scoreSchema);