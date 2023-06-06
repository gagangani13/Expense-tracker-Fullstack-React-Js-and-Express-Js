const database = require("../database/database")
const { Expense } = require("../model/expense")
const { User } = require("../model/user")

module.exports.getAllExpenses=async(req,res,next)=>{
    try {
        // const expenses=await Expense.findAll()
        // const users=await User.findAll()
        // let obj={}
        // expenses.forEach((item)=>{
        //     if (item.UserId in obj) {
        //         obj[item.UserId]+=item.amount
        //     }else{
        //         obj[item.UserId]=item.amount
        //     }
        // })
        // let arr=[]
        // users.forEach(item=>{
        //     arr.push({name:item.name,amount:obj[item.id]?obj[item.id]:0})
        // })
        // const sortedArr=arr.sort((a,b)=>b.amount-a.amount)
        //Optimization
        const allExpenses=await User.findAll({
            attributes:['id','name',[database.fn('sum',database.col('expenses.amount')),'amount']],
            include:[{
                model:Expense,
                attributes:[]
            }],
            group:['user.id'],
            order:[['amount','DESC']]
        })
        res.status(200).send({expenses:allExpenses})

    } catch (error) {
        console.log(error);
    }
    
}