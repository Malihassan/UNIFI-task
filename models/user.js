const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword =async function (passwordPlainText) {
  return await bcrypt.compare(passwordPlainText, this.password);
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;




(async () => {
  const userModalCount = await userModel.find({}).countDocuments();
  if (userModalCount == 0) {
    userModel.create({
      userName: "momenAlhendawy",
      email: "abc@gmail.com",
      password: bcrypt.hashSync("11111", 10),
    });
  }
})();