const express=require('express')
const router=express.Router()
const login=require('../controller/login')
const expense=require('../controller/expense')
const user=require('../middleware/tokenDecrypt')
const purchase=require('../controller/purchase')
const premium=require('../controller/premium')
router.post('/newUser',login.newUser)
router.post('/loginUser',login.loginUser)

router.post('/addExpense',user.tokenDecrypt,expense.addExpense)
router.get('/getExpenses',user.tokenDecrypt,expense.getExpenses)
router.delete('/deleteExpense/:Id',user.tokenDecrypt,expense.deleteExpense)

router.get('/purchasePremium',user.tokenDecrypt,purchase.PurchasePremium)
router.post('/updateTransactionStatus',user.tokenDecrypt,purchase.updateTransactionStatus)

router.get('/allExpenses',user.tokenDecrypt,premium.getAllExpenses)

module.exports=router