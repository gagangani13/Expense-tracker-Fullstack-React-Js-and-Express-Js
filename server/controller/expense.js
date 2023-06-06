const { Expense } = require("../model/expense")
const { User } = require("../model/user")

module.exports.addExpense=async(req,res,next)=>{
    const{amount,description,category}=req.body
    if(!amount||!description||!category){
        return res.status(400).send({message:'Invalid input'})
    }
    try {
        const addExpense=await Expense.create({
            amount:amount,
            description:description,
            category:category,
            UserId:req.userId
        })
        const getUser=await User.findByPk(req.userId)
        const totalAmount=Number(getUser.totalExpense)+Number(amount)
        const updateExpense=await getUser.update({totalExpense:totalAmount})
        res.status(201).send({message:'Expense added',ok:true,id:addExpense.id})
    } catch (error) {
        res.status(400).send({message:'Expense not added',ok:false})
    }
}

module.exports.getExpenses=async(req,res,next)=>{
    try {      
        const expenses=await Expense.findAll({where:{UserId:req.userId}})
        res.status(200).send({ok:true,expenses:expenses})
    } catch (error) {
        res.status(500).send({message:'Error'})
    }
}

module.exports.deleteExpense=async(req,res,next)=>{
    try {
        const findId=await Expense.findByPk(req.params.Id)
        const deleteId=await findId.destroy()
        try {
            res.status(200).send({ok:true,message:'Deleted'})
        } catch (error) {
            throw new Error()
        }
    } catch (error) {
        res.status(500).send({ok:false,message:'failed'})
    }
}
