const express=require('express')
const router=express.Router()
const controller=require('../controller/controller')
router.post('/newUser',controller.newUser)
router.post('/loginUser',controller.loginUser)
module.exports=router