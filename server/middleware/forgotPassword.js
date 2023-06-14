const { ForgotPassword } = require("../model/forgotPassword")
const { User } = require("../model/user")
require('dotenv').config()
module.exports.forgotPassword=async(req,res,next)=>{
    try {
        const {email}=req.body
        const findEmail=await User.findOne({where:{email}})
        const createForgotPasswordUUID=await ForgotPassword.create({
            isActive:true,
            UserId:findEmail.id
        })
        req.UUID=createForgotPasswordUUID.id;
        next();
    } catch (error) {
        return res.send({message:"User doesn't exists"})
    }
    
}

module.exports.validateForgotPasswordLink=async(req,res,next)=>{
    try {
        const UUID=req.params.Id
        const findPassword=await ForgotPassword.findOne({where:{id:UUID}})
        if (findPassword.isActive==1||null){
            res.redirect(`https://localhost:3000/Password/${UUID}`)
        }else{
            res.send('<h1>The link has been expired. Please request via <a href="https://localhost:3000/">Expense Tracker</a></h1>')
        }
    } catch (error) {
        res.send({message:error})
    }
}