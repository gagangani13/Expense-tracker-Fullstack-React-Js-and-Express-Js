const {User}=require('../model/user')
module.exports.newUser=async(req,res,next)=>{
    try {
        const email=req.body.email
        const password=req.body.password
        if(!email || !password){
            return res.status(400).json({err:'Invalid Input'})
        }
        const createUser=await User.create({
            email:email,
            password:password
        })
        console.log(createUser);
        res.status(201).json({message:"User Added"})
    } catch (error) {
        res.status(500).send({message:"User Exists"})
    }
}

module.exports.loginUser=async(req,res,next)=>{
    try {
        const email=req.body.email
        const password=req.body.password
        if(!email || !password){
            return res.status(400).send({message:'Invalid Input',ok:false})
        }
        const getUser=await User.findAll({where:{email:email}})
        if (getUser[0].password===password){
            res.status(200).send({message:'User Logged in',ok:true})
        }else{
            throw new Error('password incorrect')
        }
    } catch (error) {
        res.status(404).send({message:error.message,ok:false})
    }
}