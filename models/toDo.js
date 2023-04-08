const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const enumsTodo = require("../helpers/enums/enumsTodo");

const toDoSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    body: {
      type: String,
      trim: true,
      required: true,
    },
    status:{
      type: String,
      default:enumsTodo.INPROGRESS
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);


toDoSchema.plugin(aggregatePaginate);
const toDoModel = mongoose.model("ToDo", toDoSchema);
module.exports = toDoModel;
