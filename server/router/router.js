const express=require('express')
const router=express.Router()
const controller=require('../controller/controller')
router.post('/newUser',controller.newUser)
module.exports=router