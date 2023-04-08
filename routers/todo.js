const router = require("express").Router();
const toDoControllers = require('../controllers/toDo');
const { verifyToken } = require("../middleware/auth");

router.use(verifyToken)
router.post('/add',toDoControllers.addNewToDo)
router.get('/getAll',toDoControllers.getAllToDos)
router.get('/get/:id',toDoControllers.getToDoByID)
router.put('/update/:id',toDoControllers.updateToDo)
router.delete('/delete/:id',toDoControllers.deleteToDo)


module.exports = router;