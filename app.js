require ("express-async-errors")
require ("dotenv").config()

const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./db/connect")
const userRouter = require("./routes/userRoutes")
const blogRouter = require("./routes/blogRoutes")
const app = express()


app.use(express.json());
app.use('/api/users', userRouter)
app.use('/api/blogs', blogRouter)

app.get("/api", (req, res) => {
    res.send("Welcome to Blog API")
})


const PORT = process.env.URL_PORT
const start = async () => {
    try {
        await connectDB(process.env.MONGO_DB_URL)
        app.listen(PORT, () => {
            console.log(`Connected to mongodb successfully...`)
        });
    }catch (error) {
        console.log({error})
    }
};

start();