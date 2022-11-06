const { isDate } = require("moment/moment");
const mongoose = require("mongoose")

const Schema = mongoose.Schema;


const BlogSchema =  new Schema({
    title: {
         type: String, 
         required: true,
         unique: true 
        },
    description: {
        type: String 
    },
    tags: {
        type: Number
    },
    author: { 
        type: String
    },
    state: {
        type: String,
        default: "draft"
        },
    read_Count: {
        type: Number,
         default: 1
        },
    read_time: {
        type: String
    },
    body: {
        type: String,
         require: true
        },
        lastUpdateAt: {
            type: Date,
            default: Date.now
        },
});


const Blog = mongoose.model('Blog', BlogSchema);
module.exports = Blog;