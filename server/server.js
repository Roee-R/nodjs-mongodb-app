const express = require('express')
const body_parser = require('body-parser')
const objectid = require('mongodb').ObjectID
const lodash = require('lodash')


var config = require('./config/config.js')
var {mongoose} = require('./db/mongoose') // use destracion
var {user} = require('./models/User') // use destracion
var {todo} = require('./models/Todos') // use destracion

var app = express()

const port = process.env.PORT;

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

app.delete('/todo/:id',(req,res)=>{
    var id = req.params.id; // takes the id parameter from the url
    if(!objectid.isValid(id)){
        res.status(404).send("Not valid")
    }
    todo.findByIdAndDelete(id).then((todos)=>{
        if(!todos){
            return res.status(404).send("Not found")
        }
        return res.status(200).send(todos)
    }).catch((e)=>{
        console.log(e)
    })

})

app.patch('/todo/:id',(req,res)=>{
    var id = req.params.id;
    var body = lodash.pick(req.body,['text', 'completed']) // lodash feature-takes from the user just the text and complte parameters

    if(!objectid.isValid(id)){
        res.status(404).send("Not valid")
    }
    if(lodash.isBoolean(body.completed) && body.completed){ // check if the user pass: complete as boolean and it equel to true
        body.completedAt = new Date().getTime();
    }else{

        body.completedAt=null;
        body.completed=false;
    }

    // set the update for the specific todo and return the update version (new:true, like returnOriginal: false)
    todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((doc)=>{
        if(!doc){ // set the update for the specific todo
            return doc.status(404).send({});
        }

        res.status(200).send({doc});
    }).catch((e)=>{
        return res.status(400).send();
    })
})

app.listen(port,()=>{
    console.log(`Start in port ${port}`)
})

module.exports={app}
