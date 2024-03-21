const workerModel = require('../models/workerModel')
const userModel = require('../models/userModel')
const workerDeletedModel = require('../models/workerDeleteModel')


exports.getUpdateWorker = async (req, res) => {
    try {
        let worker = await workerModel.findOne({ _id: req.params.workerid })
        res.render("updateWorker/index.html.twig", {
            worker: worker,
            userName: req.session.userName
        })
    } catch (error) {
        res.send(error.message)

    }
}
exports.getAddWorker = (req, res) => {
    try {
        res.render("addWorker/index.html.twig", {
            userName: req.session.userName
        })
    } catch (error) {
        res.send(error.message)
    }
}

exports.postAddWorker = async (req, res) => {
    try {
        let newWorker = new workerModel(req.body)
        if (req.file) {
            if (req.multerError) {
                throw { errorUpload: "Le fichier n'est pas valide" };
            }
            req.body.image = req.file.filename
            newWorker.image = req.file.filename
        }
        newWorker.blameNumber = 0;
        newWorker._user = req.session.user
        await newWorker.save()
        await userModel.updateOne({ _id: req.session.user }, { $push: { workerList: newWorker._id } });
        res.redirect("/dashboard")
    } catch (error) {
        res.render("addWorker/index.html.twig")
    }
}

exports.deleteWorker = async (req, res) => {
    try {
        let deleteWorker = await workerModel.findById({ _id: req.params.workerid })
        console.log(deleteWorker)
        let workerDeleted = new workerDeletedModel({
            _id: deleteWorker._id,
            image: deleteWorker.image,
            name: deleteWorker.name,
            function: deleteWorker.function,
            blameNumber: deleteWorker.blameNumber,
            _user: deleteWorker._user
        })
        workerDeleted.save();
        await userModel.updateOne({ _id: req.session.user }, { $push: { workerDeleteList: workerDeleted._id } });
        await workerModel.deleteOne({ _id: req.params.workerid })
        res.redirect("/dashboard")
    } catch (error) {
        console.log(error)
        res.render('dashboard/index.html.twig', {
            user: await userModel.findById({ _id: req.session.user }).populate("workerList")
        })
    }
}

exports.updateWorker = async (req, res) => {
    try {
        let workerUpdated = await workerModel.updateOne({ _id: req.params.workerid }, req.body)
        if (req.file) {
            if (req.multerError) {
                throw { errorUpload: "Le fichier n'est pas valide" };
            }
            req.body.image = req.file.filename;
            workerUpdated.image = req.file.filename
        }
        await workerModel.updateOne({ _id: req.params.workerid }, req.body)
        res.redirect("/dashboard")
    } catch (error) {
        res.render('dashboard/index.html.twig', {
            user: await userModel.findById({ _id: req.session.user }).populate("workerList")
        })
    }
}

exports.addBlame = async (req, res) => {
    try {
        let worker = await workerModel.findOne({ _id: req.params.workerid })
        let blameNumber = worker.blameNumber
        blameNumber++
        if (blameNumber < 3) {
            await workerModel.updateOne({ _id: req.params.workerid }, { blameNumber: blameNumber })
        }
        else {
            await workerModel.deleteOne({ _id: req.params.workerid })
        }
        res.redirect("/dashboard")
    } catch (error) {
        res.render('dashboard/index.html.twig', {
            user: await userModel.findById({ _id: req.session.user }).populate("workerList")
        })
    }
}

exports.searchWorker = async (req, res) => {
    try {
        res.render("searchWorker/index.html.twig",
            {
                user: await userModel.findById({ _id: req.session.user }).populate({ path: "workerList", match: { name: req.body.name } }),
                userName: req.session.userName
            })
    } catch (error) {
        res.send(error)
    }
}

exports.filterByFunction = async (req, res) => {
    try {
        res.render("filterWorker/index.html.twig",
            {
                user: await userModel.findById({ _id: req.session.user }).populate({ path: "workerList", match: { function: req.body.function } }),
                userName: req.session.userName
            })
    } catch (error) {
        res.send(error)
    }
}