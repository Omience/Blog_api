const express = require("express")
const auth = require("../middleware/authentication")
const admin = require("../middleware/admin")
const blogRouter = express.Router()


const {
    getAllBlogs,
    createBlog,
    getBlogById,
    updateBlog,
    deleteBlog
} = require("../controllers/blogController")
const { request } = require("express")


blogRouter.get('/', getAllBlogs)
blogRouter.post("/", auth, createBlog)
blogRouter.get("/:blogId", getBlogById)
blogRouter.patch("/:blogId", auth, admin, updateBlog)
blogRouter.delete("/:blogId", auth, admin, deleteBlog)


module.exports = blogRouter