const Joi = require("joi");
const apiError = require("../helpers/response/apiError");
const Response = require("../helpers/response/successResponse");
const responseMessage = require("../helpers/response/responseMessage");
const validationsRequests = require("../middleware/validationsRequests");
const {
  handleValidationSchemaOfRequestsError,
} = require("../middleware/validationsRequests");
const { generateToken } = require("../middleware/auth");
const userServices = require("../services/user");

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - Users
 *     description: user Login from this Api
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: login
 *         description: login
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Returns success message
 */

async function login(req, res, next) {
  const validationSchema = Joi.object({
    email: validationsRequests.email.required(),
    password: validationsRequests.password.required(),
  });
  try {
    const {email,password} = handleValidationSchemaOfRequestsError(
      await validationSchema.validate(req.body)
    );
    const account = await userServices.findUser({ email });
    if (!account) {
      throw apiError.notfound(responseMessage.ACCOUNT_NOT_EXIST);
    }
    const validPassword =await account.comparePassword(password);
    if (!validPassword) {
      throw apiError.unauthorized(responseMessage.INVALID_CREDENTIAL);
    }
    const authorization = await generateToken({
      email: account.email,
      _id: account._id,
    });
    res.json(new Response({ authorization }, responseMessage.SUCCESS_LOGIN));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
};