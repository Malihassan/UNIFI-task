const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(`mongodb://localhost:27017/${process.env.DATABASE_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(
        "Successfully connected to database " + process.env.DATABASE_NAME
      );
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};
exports.initModels = () => {
  require("../models/index");
};
