const jwt = require("jsonwebtoken");
const apiError = require("../helpers/response/apiError");
const { TOKEN_NOT_EXIST } = require("../helpers/response/responseMessage");

module.exports  = {
  async generateToken(objData) {
    return await jwt.sign(
      {
        _id: objData._id,
        email: objData.email,
      },
      process.env.TOKEN_KEY,
      { expiresIn: "1h" }
    );
  },
  async verifyToken(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return next(apiError.forbidden(TOKEN_NOT_EXIST));
    }
    try {
      const payload = await jwt.verify(authorization, process.env.TOKEN_KEY);
      req._id = payload._id;
      req.email = payload.email;
      next()
    } catch (error) {
      next(apiError.unauthorized(error.message));
    }
  },

};

