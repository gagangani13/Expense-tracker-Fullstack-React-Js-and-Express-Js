const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const cors=require('cors')
const router=require('./router/router')
const database=require('./database/database')
const { User } = require('./model/user')
const { Expense } = require('./model/expense')
const { Order } = require('./model/order')
const { ForgotPassword } = require('./model/forgotPassword')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(ForgotPassword)
ForgotPassword.belongsTo(User)

app.use(router)
database.sync().then(res=>app.listen(5000)).catch(err=>console.log(err))