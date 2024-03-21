const userModel = require('../models/userModel')

const bcrypt = require('bcrypt')

exports.getHome = (req, res) => {
    try {
        req.session.destroy();
        res.render("homePage/index.html.twig")
    } catch (error) {
        res.send(error)
    }
}

exports.getSubsribe = (req, res) => {
    try {
        res.render("subscribePage/index.html.twig")
    } catch (error) {
        res.send(error)
    }
}

exports.getDashboard = async (req, res) => {
    try {
        res.render("dashboard/index.html.twig",
            {
                user: await userModel.findById({ _id: req.session.user }).populate("workerList"),
                userName: req.session.userName
            })
    } catch (error) {
        res.send(error)
    }
}

exports.getWorkerDelete = async (req, res) => {
    try {
        res.render("workerDelete/index.html.twig", {
            user: await userModel.findById({ _id: req.session.user }).populate("workerDeleteList"),
            userName: req.session.userName
        })
    } catch (error) {
        res.send(error.message)
    }

}

exports.postUser = async (req, res) => {
    try {
        const user = new userModel(req.body)
        user.validateSync()
        await user.save()
        res.redirect('/')
    } catch (error) {
        console.log(error.errors)
        res.render("subscribePage/index.html.twig", {
            errors: error.errors,
        }
        )
    }

}

exports.postLogin = async (req, res) => {
    try {
        let user = await userModel.findOne({ mail: req.body.mail })
        if (user) {
            if (await bcrypt.compare(req.body.password, user.password)) {
                req.session.user = user._id
                req.session.userName = user.name
                res.redirect("/dashboard")
            }
            else {
                throw { password: "Mauvais mot de passe" }
            }
        }
        else {
            throw { mail: "Cet utilisateur n'est pas enregistré" }
        }
    } catch (error) {
        res.render('homePage/index.html.twig', {
            error: error

        })
    }
}