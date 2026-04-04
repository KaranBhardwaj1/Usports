const mongoose = require("mongoose");
const Organisation = require("./models/Organisation");

mongoose.connect(process.env.MONGO_URI)
.then(async () => {

  await Organisation.create({
    email: "sports@university.com",
    password: "123456"
  });

  console.log("✅ Organisation account created!");
  process.exit();
});
