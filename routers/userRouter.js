const userRouter = require('express').Router()
const userController = require("../controllers/userController")
const authguard = require('../customDependencies/authguard')


userRouter.get("/", userController.getHome)
userRouter.get("/subscribe", userController.getSubsribe)
userRouter.get('/dashboard', authguard, userController.getDashboard)
userRouter.get('/workerDeleted', authguard, userController.getWorkerDelete)
userRouter.post("/subscribe", userController.postUser)
userRouter.post("/login", userController.postLogin)



module.exports = userRouter