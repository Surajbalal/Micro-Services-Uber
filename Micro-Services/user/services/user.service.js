const userModel = require('../models/user.models');

module.exports.createUser = async ({
    firstName,lastName,email,password
}) =>{
    if(!firstName || !email|| !password){
        throw new error('All fildes are required');
    }
    const user = userModel.create({
        fullName:{
            firstName,
            lastName
        },
        email,
        password,
    })
    return user
}
