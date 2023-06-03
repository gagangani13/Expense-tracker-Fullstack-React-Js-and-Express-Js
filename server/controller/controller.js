const {User}=require('../model/user')
module.exports.newUser=async(req,res,next)=>{
    try {
        const email=req.body.email
        const password=req.body.password
        const createUser=await User.create({
            email:email,
            password:password
        })
        res.status(201).json(createUser)
    } catch (error) {
        res.status(400).send({message:"User Exists"})
    }
}