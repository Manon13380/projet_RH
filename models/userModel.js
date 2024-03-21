const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Le nom de l'entreprise est requise"],
        validate: {
            validator: function (v) {
                return /^[^\>\<]+$/.test(v)
            }, message: "Entrez un nom valide"
        }
    },
    siretNumber: {
        type: String,
        required: [true, "Le numéro de siret est requis"],
        validate: {
            validator: function (v) {
                return /^\d{14}$/.test(v)
            }, message: "Entrez un numéro de siret valide"
        }
    },
    mail: {
        type: String,
        required: [true, "L'adresse mail est requise"],
        unique: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9_%+-][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v)
            }, message: "Entrez un mail valide"
        }
    },
    directorName: {
        type: String,
        required: [true, "Le nom du directeur est requis"],
        validate: {
            validator: function (v) {
                return /^[a-zA-ZÀ-ÿ\-']{2,}$/.test(v)
            }, message: "Entrez un nom valide"
        }
    },
    password: {
        type: String,
        required: [true, "Le mot de passe est requis"],
        validate: {
            validator: function (v) {
                return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-/]).{8,}$/.test(v)
            }, message: "Entrez un mot de passe valide : il faut min 8 caractère, une majuscule, une minuscule et un caractère spécial sauf < ou >"
        }
    },
    workerList: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "worker"
        }]
    },
    workerDeleteList: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "workerDelete"
        }]
    },
})

userSchema.pre("validate", async function (next) {
    try {
        const existingUser = await this.constructor.findOne({ mail: this.mail });
        if (existingUser) {
            this.invalidate("mail", "Cet email est déjà enregistré.")
        }
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next()
    }
    bcrypt.hash(this.password, 10, (error, hash) => {
        if (error) {
            return next(error)
        }
        this.password = hash;
        next()
    })
})

const userModel = mongoose.model("user", userSchema)
module.exports = userModel