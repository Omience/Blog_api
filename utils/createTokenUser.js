const createTokenUser = (user) => {
    return {
        name: user.first_name,
        userId: user. _id,
        userType: user.user_type,
    }
}


module.exports = createTokenUser;