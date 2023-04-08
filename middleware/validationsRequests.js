const Joi = require("joi");
const enumsTodo = require("../helpers/enums/enumsTodo");
const apiError = require("../helpers/response/apiError");

const handleCasesOfError = (errors) => {
  errors.forEach((err) => {
    let label = err.local.label;
    let limit = err.local.limit;

    switch (err.code) {
      case "string.pattern.base":
        err.message = `Invalid ${label} !`;
        break;
      case "any.allowOnly":
        err.message = `Invalid Choice from ${label}`;
        break;
      case "any.required":
      case "any.empty":
        err.message = `${label} is Required!`;
        break;
      case "string.min":
        err.message = `${label} should have at least ${limit} characters!`;
        break;
      case "string.max":
        err.message = `${label} should have at most ${limit} characters!`;
        break;
      case "number.greater":
        err.message = `${label} must be greater than ${limit}`;
        break;
      case "number.base":
        err.message = `Invalid ${label} , only number Value!`;
        break;
      case "number.min":
        err.message = `${label} should have at least ${limit} !`;
        break;
    }
  });
  return errors;
};

module.exports = {
  objectId: Joi.string().regex(/^[a-f\d]{24}$/i).error(handleCasesOfError),
  email: Joi.string().trim().lowercase()
    .regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    .error(handleCasesOfError),
  password: Joi.string().trim().error(handleCasesOfError),
  title: Joi.string().trim().min(10).error(handleCasesOfError),
  body: Joi.string().trim().min(10).error(handleCasesOfError),
  status:Joi.string().trim().valid(enumsTodo.DONE,enumsTodo.INPROGRESS).error(handleCasesOfError),
  page: Joi.number().integer().greater(0).error(handleCasesOfError),
  limit: Joi.number().integer().greater(0).error(handleCasesOfError),

  handleValidationSchemaOfRequestsError(result) {
    if (result.error) {
      throw apiError.badRequest(result.error.details[0].message);
    }
    return result.value;
  },
};
