const express = require('express')
const body_parser = require('body-parser')


var {mongoose} = require('./db/moongoose') // use destracion
var {user} = require('./models/User') // use destracion
var {todo} = require('./models/Todos') // use destracion


var app = express()

app.use(body_parser.json()) // Returns middleware that only parses 
//json and only looks at requests where the Content-Type
// header matches the type option

app.post('/todo', (req,res)=>{
    var newTodo = new todo({
        text: req.body.text
    })
    newTodo.save().then((doc)=>{
        res.send(doc)
    },(e)=>{
        res.status(400).send(e)
    })
})


app.listen(3000,()=>{
    console.log("Stsrt in port 3000")
})

