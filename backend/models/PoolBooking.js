const mongoose = require("mongoose");

const poolBookingSchema = new mongoose.Schema({
  name: String,
  universityId: String,

  tableNumber: Number,

  startTime: Date,
  endTime: Date,

  amount: Number,

  paymentStatus: {
    type: String,
    default: "Paid"
  }
});

module.exports = mongoose.model("PoolBooking", poolBookingSchema);
