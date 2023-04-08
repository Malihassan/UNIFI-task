const Joi = require("joi");
const mongoose = require("mongoose");
const Response = require("../helpers/response/successResponse");
const responseMessage = require("../helpers/response/responseMessage");
const validationsRequests = require("../middleware/validationsRequests");
const {
  handleValidationSchemaOfRequestsError,
} = require("../middleware/validationsRequests");
const {
  addNewToDo,
  getToDosList,
  deleteToDo,
  updateToDo,
  getToDoByID,
} = require("../services/todo");

module.exports = {
  /**
   * @swagger
   * /todo/add:
   *   post:
   *     tags:
   *       - ToDo
   *     description: user add new ToDo
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: authorization
   *         description: token send after login
   *         in: header
   *         required: true
   *       - name: newToDo
   *         description: newToDo
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - title
   *             - body
   *           properties:
   *             title:
   *               type: string
   *             body:
   *               type: string
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async addNewToDo(req, res, next) {
    const validationSchema = Joi.object({
      title: validationsRequests.title.required(),
      body: validationsRequests.body.required(),
    });
    try {
      const { title, body } = handleValidationSchemaOfRequestsError(
        await validationSchema.validate(req.body)
      );
      const newToDo = await addNewToDo({
        title,
        body,
        createdBy: req._id,
      });
      res.json(new Response({ newToDo }, responseMessage.DATA_CREATED));
    } catch (error) {
      next(error);
    }
  },
  /**
   * @swagger
   * /todo/getAll:
   *   get:
   *     tags:
   *       - ToDo
   *     description: get todo list
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: authorization
   *         description: token send after login
   *         in: header
   *         required: true
   *       - name: page
   *         description: page
   *         in: query
   *         required: false
   *       - name: limit
   *         description: limit
   *         in: query
   *         required: false
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async getAllToDos(req, res, next) {
    const validationSchema = Joi.object({
      page: validationsRequests.page.optional(),
      limit: validationsRequests.limit.optional(),
    });

    try {
      let { page, limit } = handleValidationSchemaOfRequestsError(
        await validationSchema.validate(req.query)
      );
      limit = Number(limit) || 5;
      page = Number(page) || 1;
      const options = {
        limit,
        page,
      };
      const result = await getToDosList(req._id, options);
      res.json(new Response(result, responseMessage.DATA_FETCHED));
    } catch (error) {
      // console.log(error);
      next(error);
    }
  },
  /**
   * @swagger
   * /todo/get/{id}:
   *   get:
   *     tags:
   *       - ToDo
   *     description: get todo by Id
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: authorization
   *         description: token send after login
   *         in: header
   *         required: true
   *       - name: id
   *         description: get todo by ID
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success responsage
   */
  async getToDoByID(req, res, next) {
    const validationSchema = Joi.object({
      id: validationsRequests.objectId.required(),
    });
    try {
      const { id } = handleValidationSchemaOfRequestsError(
        await validationSchema.validate(req.params)
      );
      const result = await getToDoByID({
        _id: mongoose.Types.ObjectId(id),
        createdBy: mongoose.Types.ObjectId(req._id),
      });
      res.json(new Response(result, responseMessage.DATA_FETCHED));
    } catch (error) {
      next(error);
    }
  },

  /**
   * @swagger
   * /todo/update/{id}:
   *   put:
   *     tags:
   *       - ToDo
   *     description: update  ToDo
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: authorization
   *         description: token send after login
   *         in: header
   *         required: true
   *       - name: id
   *         description: Todo ID
   *         in: path
   *         required: true
   *       - name: newToDo
   *         description: newToDo
   *         in: body
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - title
   *             - body
   *             - status
   *           properties:
   *             title:
   *               type: string
   *             body:
   *               type: string
   *             status:
   *               type: string
   *               enum: ["done","in progress"]
   *     responses:
   *       200:
   *         description: Returns success message
   */
  async updateToDo(req, res, next) {
    const validationSchema = Joi.object({
      title: validationsRequests.title.optional(),
      body: validationsRequests.body.optional(),
      status: validationsRequests.status.optional(),
      id: validationsRequests.objectId.required(),
    });
    try {
      const { title, body, status, id } = handleValidationSchemaOfRequestsError(
        await validationSchema.validate({ ...req.body, id: req.params.id })
      );
      const query = {
        _id: mongoose.Types.ObjectId(id),
        createdBy: mongoose.Types.ObjectId(req._id),
      };
      const obj = {
        title,
        body,
        status,
      };
      const result = await updateToDo(query, obj);
      res.json(new Response(result, responseMessage.UPDATE_SUCCESS));
    } catch (error) {
      next(error);
    }
  },
  /**
   * @swagger
   * /todo/delete/{id}:
   *   delete:
   *     tags:
   *       - ToDo
   *     description: Delete todo by Id
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: authorization
   *         description: token send after login
   *         in: header
   *         required: true
   *       - name: id
   *         description: delete todo by ID
   *         in: path
   *         required: true
   *     responses:
   *       200:
   *         description: Returns success responsage
   */
  async deleteToDo(req, res, next) {
    const validationSchema = Joi.object({
      id: validationsRequests.objectId.required(),
    });
    try {
      const { id } = handleValidationSchemaOfRequestsError(
        await validationSchema.validate(req.params)
      );
      const result = await deleteToDo({
        _id: mongoose.Types.ObjectId(id),
        createdBy: mongoose.Types.ObjectId(req._id),
      });
      res.json(new Response(result, responseMessage.DELETE_SUCCESS));
    } catch (error) {
      next(error);
    }
  },
};
