const router = require('express').Router()
const toDoRouters = require('./todo')
const userRouters = require('./user')


router.use('/ToDo',toDoRouters);
router.use('/user',userRouters);



module.exports = router