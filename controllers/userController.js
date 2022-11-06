const User = require("../models/userModel");
const {StatusCodes} = require("http-status-codes");
const CustomError = require("../errors");
const {createTokenUser, createJWT} = require("../utils");



const signup = async(req, res) => {
    const {first_name, last_name, email, password, isAdmin} = req.body
    const emailAlreadyExist = await User.findOne({email})
    if(emailAlreadyExist){
        throw new CustomError.BadRequestError("Email already exist")
        return;
    }


    const firstAccount = await User.countDocuments({}) === 0;
    const user_type = firstAccount ? 'admin' : 'user';

    const user = await User.create({first_name, last_name, email, password, user_type, isAdmin});

    await user.save()
    const token = await user.generateAuthToken();

     res.status(StatusCodes.CREATED).json({user, token});
};


const signIn = async(req, res) => {
    const {email, password} = req.body;

    if(!email) {
        throw new CustomError.BadRequestError("Incorrect email")
    }
    const user = await User.findOne({email});

    if (!user) {
        throw new CustomError.UnauthorizedError("Invalid credentials")
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError("Invalid Login")
    }

    const token = await user.generateAuthToken();

    res.status(StatusCodes.OK).json({user, token});
};


module.exports = {signup, signIn};