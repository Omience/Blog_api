const express = require("express")
const mongoose = require("mongoose")
const moment = require("moment")
const Blog = require("../models/blogModel")

// try{
// //filtering
// const queryObj = { ...req.query }
// const excludedBlogs = ['page', 'sort', 'limit', 'fields']
// excludedBlogs.forEach(el => delete queryObj[el])

// //Advanced filtering
// let queryString = JSON.stringify(queryObj)
// queryString = queryString.replace(/\b(gte|lte|lt)\b/g, match => `$${match}`)
// let query = Blog.find(JSON.parse(queryString))

// //sorting
// if (req.query.sort){
//     const sortBy = req.query.sort.split(',').join(' ')
//     query = query.sort(sortBy)
// }else{
//     query = query.sort('-createdAt')
// }

// //execute Query
// const blogs = async (req, res) => {
//     const blogs = await query
// res.status(200).json({
//     status: 'success',
//     result: blogs.length,
//     data: {
//         blogs
//     }
// });
// }
// }catch (error){
//     res.status(400).json({ message: err})
// }


//getAllBlogs 
const getAllBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog
          .find(req.findFilter)
          .sort(req.sort)
          .select(req.fields)
          .populate('author', { username: 1 })
          .skip(req.pagination.start)
          .limit(req.pagination.sizePerPage)
    
        const pageInfo = req.pageInfo
    
        return res.json({
          status: 'success',
          pageInfo,
          data: blogs,
        })
      } catch (err) {
        err.source = 'get published blogs controller'
        next(err)
      } 
}



const createBlog = async (req, res) => {
    const blog = req.body
    const user = req.user ? req.user : null;
    
    if (!req.body.body) {
        return res.status(401).json({ message: "Blog body can not be empty" })
    }
    if (user && user.isAdmin && user.user_type === 'admin') {
        blog.state = "published"
    } else {
        blog.state = "draft"
    }
    blog.read_count = 1
    blog.lastUpdateAt = new Date()
    blog.timeStamp = Date.now
    Blog.create(blog)
        .then(blog => {
            res.status(201).send(blog)
            console.log(blog)
        })
        .catch(err => {
            console.log(err)
            if (err.code === 11000) {
                res.status(500).send({ message: "Title already exist" })
            }
        })
}




const getBlogById = async (req, res) => {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId)

    if(blog.state !=="published") {
        return res.status(403).json({message: "Sorry,its not yet published"})
    }

    if (!blog) {
        return res.status(404).json({ status: false, blog: null })
    }
    return res.json({ status: true, blog})
}



const updateBlog = async (req, res) => {
    const { blogId } = req.params;
    const { state } = req.body;
    const { user_type } = req.body;

    const blog = await Blog.findById(blogId)

    if (!blog) {
        return res.status(404).json({ status: false, blog: null })
    }

    if (state < blog.state) {
        return res.status(422).json({ status: false, blog: null })
    }

    blog.state = "published";

    await blog.save()

    return res.json({ status: true, blog })
}


const deleteBlog = async (req, res) => {
    const { blogId } = req.params;
    const blog = await Blog.deleteOne({ _id: blogId })
    return res.json({ status: true, blog })
}


module.exports = {
    getAllBlogs,
    createBlog,
    getBlogById,
    updateBlog,
    deleteBlog
}