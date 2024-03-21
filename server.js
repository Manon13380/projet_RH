const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routers/userRouter')
const workerRouter = require('./routers/workerRouter')
const session = require('express-session')


require('dotenv').config()
const app = express()

app.use(express.json())
app.use(express.static("./assets"))
app.use(express.urlencoded({extended : true}))


app.use(session({
    secret : process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
app.use(userRouter)
app.use(workerRouter)


app.listen(process.env.PORT, (err) => {
    if (!err) {
        console.log("Connecté au serveur")
    }
    else {
        console.log(err)
    }
}
)

mongoose.connect(process.env.URIDB)