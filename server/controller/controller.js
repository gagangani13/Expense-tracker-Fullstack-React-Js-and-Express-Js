const {User}=require('../model/user')
const bcrypt=require('bcrypt')
module.exports.newUser=async(req,res,next)=>{
    if(!req.body.email || !req.body.password){
        return res.status(400).json({err:'Invalid Input'})
    }
    try {
        const email=req.body.email
        const password=req.body.password
        bcrypt.hash(password,10,async(err,result)=>{
            if (err){
                throw new Error()
            }
            const createUser=await User.create({
                email:email,
                password:result
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
        return res.status(400).send({message:'Invalid Input',ok:false})
    }
    try {
        const getUser=await User.findAll({where:{email:email}})
        if(!getUser){
            throw new Error("User doesn't exists")
        }
        bcrypt.compare(password,getUser[0].password,(err,result)=>{
            if (err) {
                throw new Error('Something went wrong')
            }
            else if (result) {
                res.status(200).send({message:'User Logged in',ok:true})          
            } else {
                return res.status(404).send("Incorrect password")
            }
        })
    } catch (error) {
        res.status(404).send({message:error.message,ok:false})
    }
}