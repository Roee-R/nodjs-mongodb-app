const express = require('express')
const body_parser = require('body-parser')
const objectid = require('mongodb').ObjectID
const lodash = require('lodash')
const bcrypt = require('bcryptjs') //  password hashing module


var config = require('./config/config.js')
var {mongoose} = require('./db/mongoose') // use destracion
var {User} = require('./models/User') // use destracion
var {todo} = require('./models/Todos') // use destracion
const {authenticate} = require('./middleware/authenticate.js')

var app = express()

const port = process.env.PORT;

app.use(body_parser.json()) // Returns middleware that only parses 
//json and only looks at requests where the Content-Type
// header matches the type option

app.post('/todo', authenticate, (req,res)=>{ // post some todo (byID) and return it
    var newTodo = new todo({
        text: req.body.text,
        creatorId: req.user._id
    })
    newTodo.save().then((doc)=>{
        res.send(doc)
    },(e)=>{
        res.status(400).send(e)
    })
})

app.get('/todo', authenticate, (req,res)=>{ // get all todos (for specific id)
    todo.find({
       creatorId: req.user._id
    }).then((todos)=>{
        res.send({todos})
    })
},(e)=>{
    res.text(400).send(console.log("Error"))
})

app.get('/todo/:id',authenticate, (req,res)=>{ //:id reperesent the key value of the user sending parameter
    var id = req.params.id;
    if(!objectid.isValid(id)){
        res.status(404).send()
    }

    todo.findOne({
        _id: id,
        creatorId: req.user._id
    }).then((todos)=>{
        if(todos){
            res.send({todos})
        }
        else{
            res.status(404).send({})
        }
    },(e)=>{res.status(400).send(console.log({}))})
})

app.delete('/todo/:id',authenticate, (req,res)=>{
    var id = req.params.id; // takes the id parameter from the url

    if(!objectid.isValid(id)){
        res.status(404).send("Not valid")
    }   

    todo.findOneAndRemove({
        _id: id,
        creatorId: req.user._id
    }).then((todos)=>{
        if(!todos){
            return res.status(404).send("todo Not found")
        }
        return res.status(200).send(todos)
    }).catch((e)=>{
        console.log(e)
    })

})

app.patch('/todo/:id', authenticate, (req,res)=>{
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
    todo.findOneAndUpdate({
        _id: id,
        creatorId: req.user._id
    }, {$set: body}, {new: true}).then((doc)=>{
        if(!doc){ // set the update for the specific todo
            return res.status(404).send({});
        }

        res.status(200).send({doc});
    }).catch((e)=>{
        return res.status(400).send();
    })
})

app.post('/users',(req,res)=>{
    var body = lodash.pick(req.body,['email', 'password'])
    var newUser = new User(body)
    newUser.save().then(()=>{
        return newUser.generateAuthToken() //since we expected chain promise (then())
        // res.send(user)
    }).then((token)=>{ // the token in User.js with promise
        res.header('x-auth', token).send(newUser.getJson()) // set header to our res
    }).catch((e)=>{res.status(400).send()})
})

app.post('/users/login',(req,res)=>{
    var body = lodash.pick(req.body,['email', 'password'])
    User.findByCredentials(body.email,body.password).then((user)=>{ // findes the user
        user.generateAuthToken().then((token)=>{ // Because we relogin so we want to differ logins from several devices
            res.status(200).header('x-auth', token).send(user.getJson());
        })

    }).catch((e)=>{res.status(400).send()})

})


app.get('/users/me', authenticate,(req,res)=>{
    res.send(req.user.getJson());
})

app.delete('/users/me/token',authenticate, (req,res)=>{  // delete user by x-auth: token
    //authenticate- to authenticate and get the user token
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    }).catch((e)=>{
        res.status(400).send();
    })
})
app.listen(port,()=>{
    console.log(`Start in port ${port}`)
})

module.exports={app}
