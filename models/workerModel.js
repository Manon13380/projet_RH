const mongoose = require('mongoose')
const userModel = require('./userModel')

const workerSchema = new mongoose.Schema({
    image: {
        type: String,
        default: "image_default.png"
    },
    name: {
        type: String,
        required: [true, "Le nom de l'employé est requis"]
    },
    function: {
        type: String,
        required: [true, "La fonction est requise"]
    },
    blameNumber: {
        type: String,
    },
    _user: {
        type: String
    }
})




workerSchema.post("deleteOne", async function (doc, next) {
    try {
        const deletedWorkerId = doc._id;
        await userModel.updateOne({ workerList: { $in: [deletedWorkerId] } }, { $pull: { workerList: deletedWorkerId } })
        next()
    } catch (error) {
        throw error
    }

})


const workerModel = mongoose.model('worker', workerSchema)
module.exports = workerModel