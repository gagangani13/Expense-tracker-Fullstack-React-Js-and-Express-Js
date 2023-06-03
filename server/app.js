const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const cors=require('cors')
const router=require('./router/router')
const database=require('./database/database')
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(router)
database.sync().then(res=>app.listen(5000)).catch(err=>console.log(err))