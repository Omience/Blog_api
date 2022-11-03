const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const userSchema = new mongoose.Schema({
    first_name: {
        type: String, 
        require: true
    },
    last_name: {
        type: String,
         require: true
        },
    email: {
        type: String,
         require: true, 
         unique: true 
        },
    password: {
        type: String, 
        require: true
    },
    user_type: {
        type: String,
         default: 'user',
          enum: [ "admin", "user"]
        },
    isAdmin: {
        type: Boolean
    }   
});

userSchema.method.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    return userObject
}


userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(6);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (clientPassword) {
    const isMatch = await bcrypt.compare(clientPassword, this.password);
     return isMatch;   
} 

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id, isAdmin:this.isAdmin}, process.env.JWTSECRET, {expiresIn: process.env.JWT_LIFETIME})
    return token
}

const User = mongoose.model("User", userSchema);

module.exports = User;