const {Sequelize}=require('sequelize')
const database=new Sequelize('expensetracker','root','Gani#270927',{
    dialect:'mysql',
    host:'localhost'
})
module.exports=database