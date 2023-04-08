const mongoose = require("mongoose");
const apiError = require("../helpers/response/apiError");
const { findOne } = require("./commonServices");
const User = mongoose.model("User");
module.exports = {
  async findUser({ email }) {
    return findOne(User, { email });
  },
};
