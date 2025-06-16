const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("Database Connected Succesfully"))
    .catch((error) => {
      console.log("Facing issues while connecting to db");
      console.log(error);
      process.exit(1);
    });
};
