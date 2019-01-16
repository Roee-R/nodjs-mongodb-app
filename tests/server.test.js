const expect = require('expect')
const request = require('supertest')

const {app} = require('./../server/server')
const {todo} = require('./../server/models/Todos')

beforeEach((done)=>{ // before each post it removes evert textx in db with mongoose
    todo.remove({}).then(()=>done()) // ES6 synatx
})

describe('/post todo', ()=>{
    it('should create new todo',(done)=>{
        var text = "Some new todo"
// all checks for sending post
        request(app)
        .post('/todo')
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text) // check if the text from the post are the text we added
        }).end((err,res)=>{ // function to check if the value is saved in DB
            if(err){
                return console.log(err)
            }
            else{
                todo.find().then((todos)=>{
                    expect(todos.length).toBe(1) // check in moongose/todos if there is one text (that we send here)
                    expect(todos[0].text).toBe(text) // check in moongose/todos if the value is our value (that we send here)
                    done() // end the process
                }).catch((e)=>{done(e)}) // if one of above failed
            }
        })
    })


    it('should not create to with invalid data',(done)=>{
// all checks for sending post
        request(app)
        .post('/todo')
        .send({})
        .expect(400)
        .end((err,res)=>{ // function to check if the value is saved in DB
            if(err){
                return console.log(err)
            }
            else{
                todo.find().then((todos)=>{
                    expect(todos.length).toBe(0) // check in moongose/todos if there is one text (that we send here)
                    done() // end the process
                }).catch((e)=>{done(e)}) // if one of above failed
            }
        })
    })
})