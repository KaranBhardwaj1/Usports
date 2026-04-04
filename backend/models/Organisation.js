const mongoose = require("mongoose");

const organisationSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String
});

module.exports = mongoose.model("Organisation", organisationSchema);