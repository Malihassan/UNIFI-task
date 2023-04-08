const mongoose = require("mongoose");
const apiError = require("../helpers/response/apiError");
const responseMessage = require("../helpers/response/responseMessage");
const {
  addNew,
  aggregatePaginate,
  deleteOne,
  findOne,
  updateOne,
} = require("./commonServices");
const ToDo = mongoose.model("ToDo");

module.exports = {
  async addNewToDo(obj) {
    const toDoisExist = await findOne(ToDo, { title: obj.title });
    if (toDoisExist) {
      throw apiError.badRequest("ToDo is exist before");
    }
    return addNew(ToDo, obj);
  },
  async getToDoByID(query) {
    const toDoisExist = await findOne(ToDo, query);
    if (toDoisExist === null) {
      throw apiError.badRequest(responseMessage.UNABLE_FETCHED_DATA);
    }
    return toDoisExist;
  },
  async deleteToDo(query) {
    const deletedItem = await deleteOne(ToDo, query);
    if (deletedItem === null) {
      throw apiError.badRequest(responseMessage.UNABLE_DELETE);
    }
  },
  async getToDosList(userId, option) {
    return aggregatePaginate(
      ToDo,
      [
        {
          $match: {
            createdBy: mongoose.Types.ObjectId(userId),
          },
        },
        {
          $project: {
            createdBy: 0,
            __v: 0,
          },
        },
      ],
      option
    );
  },
  async updateToDo(query, obj) {
    const updated = await updateOne(ToDo, query, obj);
    if (updated === null) {
      throw apiError.badRequest(responseMessage.UNABLE_UPDATE);
    }
    return updated;
  },
};
