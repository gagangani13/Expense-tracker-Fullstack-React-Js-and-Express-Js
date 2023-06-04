const express=require('express')
const router=express.Router()
const login=require('../controller/login')
const expense=require('../controller/expense')
router.post('/newUser',login.newUser)
router.post('/loginUser',login.loginUser)
router.post('/addExpense',expense.addExpense)
router.get('/getExpenses',expense.getExpenses)
router.delete('/deleteExpense/:Id',expense.deleteExpense)
module.exports=router