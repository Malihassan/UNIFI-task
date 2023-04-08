const express = require("express");
const CORS = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");
require("dotenv").config();
require("./config/database").connect();
require('./config/database').initModels()
const router = require("./routers/index");
const {errorHanlder,unhandledRequest} = require("./middleware/apiErrorHandler");


const app = express();
const root = path.normalize(`${__dirname}`);

app.use(express.json());
app.use(router);
app.use(
  CORS({
    allowedHeaders: ["Content-Type", "authorization"],
    exposedHeaders: ["authorization"],
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  })
);
const options = {
  swaggerDefinition: {
    info: {
      title: "Swagger UNIFI assignment",
      version: "1.0.0",
    },
    basePath: "/",
  },
  apis: [path.resolve(`${root}/controllers/**/*.js`)],
};
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(options)));
app.use(errorHanlder);
app.use(unhandledRequest);

module.exports = app;
