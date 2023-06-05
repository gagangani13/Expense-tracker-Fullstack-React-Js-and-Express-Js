const { INTEGER, STRING } = require('sequelize');
const database=require('../database/database');
const Expense=database.define('Expense',{
    id:{
        primaryKey:true,
        type:INTEGER,
        autoIncrement:true
    },
    amount:{
        allowNull:false,
        type:INTEGER
    },
    description:{
        allowNull:false,
        type:STRING
    },
    category:{
        allowNull:false,
        type:STRING
    }
})

module.exports.Expense=Expense;