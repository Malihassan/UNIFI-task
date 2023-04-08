const router = require("express").Router();
const userControllers = require('../controllers/user')

router.post('/login',userControllers.login)

module.exports = router;