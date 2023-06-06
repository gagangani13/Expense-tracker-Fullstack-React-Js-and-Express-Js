const { UUID, BOOLEAN, UUIDV4 } = require('sequelize')
const database=require('../database/database')
module.exports.ForgotPassword=database.define('ForgotPassword',{
    id:{
        type:UUID,
        primaryKey:true,
        defaultValue:UUIDV4
    },
    isActive:BOOLEAN,
})