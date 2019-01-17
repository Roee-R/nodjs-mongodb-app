const express = require('express')
const body_parser = require('body-parser')
const objectid = require('mongodb').ObjectID


var {mongoose} = require('./db/mongoose') // use destracion
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

app.get('/todo', (req,res)=>{
    todo.find().then((todos)=>{
        res.send({todos})
    })
},(e)=>{
    res.text(400).send(console.log("Error"))
})

app.get('/todo/:id', (req,res)=>{ //:id reperesent the key value of the user sending parameter
    var id = req.params.id;
    if(!objectid.isValid(id)){
        res.status(404).send()
    }

    todo.findById(id).then((todos)=>{
        if(todos){
            res.send({todos})
        }
        else{
            res.status(404).send({})
        }
    },(e)=>{res.status(400).send(console.log({}))})
})

app.listen(3000,()=>{
    console.log("Start in port 3000")
})

module.exports={app}
