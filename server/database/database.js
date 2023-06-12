const {Sequelize}=require('sequelize')
require('dotenv').config()
const database=new Sequelize(process.env.DATABASE_NAME,process.env.DATABASE_USER,process.env.DATABASE_PASSWORD,{
    dialect:'mysql',
    host:process.env.DATABASE_HOST
})
module.exports=database