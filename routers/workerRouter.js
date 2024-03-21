const workerRouter = require('express').Router()
const workerController = require('../controllers/workerController')
const authguard = require('../customDependencies/authguard')
const multer = require('../customDependencies/multer-config')

workerRouter.post('/addWorker',  multer.single("image"),workerController.postAddWorker)
workerRouter.post('/updateWorker/:workerid', multer.single("image"),workerController.updateWorker)
workerRouter.get('/deleteWorker/:workerid',authguard, workerController.deleteWorker)
workerRouter.get('/addWorker', authguard, workerController.getAddWorker)
workerRouter.post('/searchWorker',authguard, workerController.searchWorker)
workerRouter.post('/filterByFunction',authguard, workerController.filterByFunction)
workerRouter.get('/updateWorker/:workerid',authguard, workerController.getUpdateWorker)
workerRouter.get('/addBlame/:workerid', workerController.addBlame)
module.exports = workerRouter