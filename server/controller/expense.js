const database = require("../database/database")
const { Expense } = require("../model/expense")
const { User } = require("../model/user");

module.exports.addExpense=async(req,res,next)=>{
    const t=await database.transaction();
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
        },{transaction:t})
        const getUser=await User.findByPk(req.userId)
        const totalAmount=Number(getUser.totalExpense)+Number(amount)
        const updateExpense=await getUser.update({totalExpense:totalAmount},{transaction:t})
        try {
            await t.commit()
            res.status(201).send({message:'Expense added',ok:true,id:addExpense.id})
        } catch (error) {
            throw new Error()
        }
    } catch (error) {
        await t.rollback()
        res.status(400).send({message:'Expense not added',ok:false})
    }
}

module.exports.getExpenses=async(req,res,next)=>{
    try {     
        const itemsPerPage=Number(req.query.size)||2;
        let page=Number(req.query.page)
        const count=await Expense.count({where:{UserId:req.userId}})
        while ((itemsPerPage*(page-1)>=count)&&page>1){
            page-=1
        }
        const offset=itemsPerPage*(page-1)
        if((offset)<=count){
            const expenses=await Expense.findAll({where:{UserId:req.userId},
                offset:offset,
                limit:itemsPerPage,
                order:[['createdAt','DESC']]
            })
            res.send({
                ok:true,
                currentPage:page,
                previousPage:page-1,
                nextPage:page+1,
                expenses:expenses,
                lastPage:Math.ceil(count/itemsPerPage)
            })
        }
    } catch (error) {
        res.status(500).send({message:'Error'})
    }
}

module.exports.deleteExpense=async(req,res,next)=>{
    const t=await database.transaction()
    try {
        const findExpense=await Expense.findByPk(req.params.Id)
        const findUser=await User.findByPk(req.userId)
        const removeExpense=Number(findUser.totalExpense)-Number(findExpense.amount)
        const updateUser=await findUser.update({totalExpense:removeExpense},{transaction:t})
        const deleteId=await findExpense.destroy({transaction:t})
        try {
            await t.commit()
            res.status(200).send({ok:true,message:'Deleted'})
        } catch (error) {
            throw new Error()
        }
    } catch (error) {
        await t.rollback()
        res.status(500).send({ok:false,message:'failed'})
    }
}
