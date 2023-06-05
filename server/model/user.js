const database=require('../database/database');
const {Sequelize, INTEGER, STRING, BOOLEAN}=require('sequelize')
module.exports.User=database.define('User',{
    id:{
        type:INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    email:{
        allowNull:false,
        unique:true,
        type:STRING
    },
    password:{
        allowNull:false,
        type:STRING
    },
    name:STRING,
    premium:BOOLEAN
})