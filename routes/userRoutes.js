const express = require("express")
const userRouter = express.Router()

const{
    signup,
    signIn
                } = require("../controllers/userController")


userRouter.post("/signup", signup)
userRouter.post("/signIn", signIn)


module.exports = userRouter;