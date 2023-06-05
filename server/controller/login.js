const {User}=require('../model/user')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
function userEncrypt(id){
    return jwt.sign(id,'ufhuebfdnvddsd8t4y48irnigmv04t409g0bjmbwbfknbknnrgjbg')
}
module.exports.newUser=async(req,res,next)=>{
    if(!req.body.email || !req.body.password){
        return res.status(400).json({err:'Invalid Input'})
    }
    try {
        const email=req.body.email
        const password=req.body.password
        const name=req.body.name
        bcrypt.hash(password,10,async(err,result)=>{
            if (err){
                throw new Error()
            }
            const createUser=await User.create({
                email:email,
                password:result,
                name:name
            })
            console.log(createUser);
            res.status(201).json({message:"User Added"})
        })
    } catch (error) {
        res.status(500).send({message:"User Exists"})
    }
}

module.exports.loginUser=async(req,res,next)=>{
    const email=req.body.email
    const password=req.body.password
    if(!email || !password){
        return res.status(200).send({message:'Invalid Input',ok:false})
    }
    try {
        const getUser=await User.findAll({where:{email:email}})
        bcrypt.compare(password,getUser[0].password,(err,result)=>{
            if (err) {
                throw new Error('Something went wrong')
            }
            else if (result) {
                res.status(200).send({message:'User Logged in',ok:true,emailId:getUser[0].email,id:getUser[0].id,idToken:userEncrypt(getUser[0].id),premium:getUser[0].premium})          
            } else {
                res.status(200).send({message:'Incorrect password',ok:false})
            }
        })
    } catch (error) {
        res.status(200).send({message:"User doesn't exists",ok:false})
    }
}