const express = require('express')
const mongoose = require('mongoose');

const app = express()
app.listen(3000)

mongoose.connect('mongodb://127.0.0.1:27017/todo')

const test = mongoose.model('my_data',mongoose.Schema({
    name:{
        type:String
    },
    status:{
        type:Boolean
    }
}),'my_data');

app.use(express.static('./public'))
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))


app.get("/",async(req,res)=>{
    const data = await test.find();
    res.render('main.ejs',{data:data});
})

app.get("/deleter/:id",async(req,res)=>
{
    await test.findByIdAndDelete(req.params.id)
    res.redirect("/")
    
})

app.post("/inserter",async(req,res)=>{
    await test.insertOne({name:req.body.name,status:true})
    res.redirect("/")
})

app.get("/completer/:id",async(req,res)=>{
    const task = await test.findById(req.params.id);
    task.status = !task.status;
    await task.save();

    res.redirect("/");
})