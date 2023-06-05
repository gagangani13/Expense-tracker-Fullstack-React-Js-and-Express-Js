const express=require('express')
const router=express.Router()
const login=require('../controller/login')
const expense=require('../controller/expense')
const user=require('../middleware/tokenDecrypt')
const premium=require('../controller/purchase')

router.post('/newUser',login.newUser)
router.post('/loginUser',login.loginUser)

router.post('/addExpense',user.tokenDecrypt,expense.addExpense)
router.get('/getExpenses',user.tokenDecrypt,expense.getExpenses)
router.delete('/deleteExpense/:Id',expense.deleteExpense)

router.get('/purchasePremium',user.tokenDecrypt,premium.PurchasePremium)
router.post('/updateTransactionStatus',user.tokenDecrypt,premium.updateTransactionStatus)
module.exports=router