const express = require("express")
const mongoose = require("mongoose")
const moment = require("moment")
const Blog = require("../models/blogModel")


const getAllBlogs = async (req, res) => {
    const blogs = await Blog.find()
    return res.status(200).json({message: blogs})
}


const createBlog = async (req, res) => {
    const body = req.body;
   

    const blog = await Blog.create({
        body: body.blog,
        timeStamp: moment().toDate()
    })
   
    if(!blog) {
        return res.status(401).json({message: "Blog not created"})
    }
    return res.status(200).json({message: blog})
}


const getBlogById = async(req, res) => {
    const {blogId} = req.params;
    const blog = await Blog.findById(blogId)
    
    if(!blog) {
        return res.status(404).json({status: false, blog: null})
    }
    return res.json({status: true, blog})
}

const updateBlog = async (req, res) => {
    const {blogId} = req.params;
    const {state} = req.body;
    const {user_type} = req.body;

    const blog = await Blog.findById(blogId)

    if(!blog) {
        return res.status(404).json({status: false, blog: null})
    }

    if (state < blog.state) {
        return res.status(422).json({ status: false, blog: null})
    } 

    blog.state = published;

    await blog.save()

    return res.json({status: true, blog})
}


const deleteBlog = async (req, res) => {
    const{blogId} = req.params;
    const blog = await Blog.deleteOne({_id: blogId})
    return res.json({status: true, blog})
}


module.exports = {
    getAllBlogs,
    createBlog,
    getBlogById,
    updateBlog,
    deleteBlog
}