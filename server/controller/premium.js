const database = require("../database/database")
const { Expense } = require("../model/expense")
const { User } = require("../model/user")

module.exports.getAllExpenses=async(req,res,next)=>{
    try {
        //Optimization
        // const allExpenses=await User.findAll({
        //     attributes:['id','name',[database.fn('sum',database.col('expenses.amount')),'totalAmount']], //fn(method,table col,new name)
        //     include:[{
        //         model:Expense,
        //         attributes:[]
        //     }],
        //     group:['user.id'], //Grouped according to id column in users table
        //     order:[['totalAmount','DESC']] // Descending order related to totalAmount value
        // })
        const allExpenses=await User.findAll({
            attributes:['name','totalExpense'],
            order:[['totalExpense','DESC']]
        })
        res.status(200).send({expenses:allExpenses})

    } catch (error) {
        console.log(error);
    }
    
}