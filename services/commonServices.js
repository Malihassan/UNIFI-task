const apiError = require("../helpers/response/apiError");
const toDoModel = require("../models/toDo");

module.exports = {
  async addNew(schema, obj) {
    try {
      const newOne = new schema(obj);
      return newOne.save();
    } catch (error) {
      throw apiError.internal(error.message);
    }
  },
  async findById(schema, id, selectFields) {
    try {
      return schema.findById(id, selectFields);
    } catch (error) {
      throw apiError.internal(error.message);
    }
  },
  async findOne(schema, query, selectFields) {
    try {
      return schema.findOne(query, selectFields);
    } catch (error) {
      throw apiError.internal(error.message);
    }
  },
  async updateOne(schema, query, data, selectedFields) {
    try {
      return schema.findOneAndUpdate(query, data, {
        new: true,
        runValidators: true,
        fields: selectedFields,
      });
    } catch (error) {
      throw apiError.internal(error.message);
    }
  },
  async deleteOne(schema, query) {
    try {
      return schema.findOneAndDelete(query);
    } catch (error) {
      throw apiError.internal(error.message);
    }
  },
  async aggregatePaginate(schema, pipeline, options) {
    try {
      const aggregate = schema.aggregate(pipeline);
      return schema.aggregatePaginate(aggregate, options);
    } catch (error) {
      throw apiError.internal(error.message);
    }
  },
};
