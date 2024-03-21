const mongoose = require('mongoose')


const workerDeleteSchema = new mongoose.Schema({
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

const workerDeleteModel = mongoose.model('workerDelete', workerDeleteSchema)
module.exports = workerDeleteModel
