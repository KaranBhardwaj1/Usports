const mongoose = require("mongoose");
const Organisation = require("./models/Organisation");

mongoose.connect("mongodb://127.0.0.1:27017/university_sports")
.then(async () => {

  await Organisation.create({
    email: "sports@university.com",
    password: "123456"
  });

  console.log("✅ Organisation account created!");
  process.exit();
});