const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/university_sports");

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Admin",
    email: "admin@sports.com",
    password: hashedPassword,
    role: "admin"
  });

  console.log("Admin created");
  process.exit();
}

createAdmin();
