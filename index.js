require("dotenv").config();
const server = require('./app')


server.listen(process.env.PORT, () => {
    console.log(`listen on port ${process.env.PORT}`);
  });