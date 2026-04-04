const mongoose = require("mongoose");

const poolTableSchema = new mongoose.Schema({
  tableNumber: Number,
  available: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("PoolTable", poolTableSchema);
