const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')
const {app} = require('./../server/server') // destracture use, import the verible "app"
const {todo} = require('./../server/models/Todos')

var todosA = [
    {
    _id : new ObjectID(),
    text: "Hey first test text!@!!"   
    },
    {
        _id : new ObjectID(),
        text: "Hey secod test text!@!!",
        completed: true
    }];

beforeEach((done)=>{ // before each post it removes evert textx in db with mongoose
    todo.remove({}).then(()=>{
        return todo.insertMany(todosA)
    }).then(()=>done()) // ES6 synatx
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
                todo.find({text}).then((todos)=>{
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
                    expect(todos.length).toBe(todosA.length) // check in moongose/todos if there is one text (that we send here)
                    done() // end the process
                }).catch((e)=>{done(e)}) // if one of above failed
            }
        })
    })
})


describe('/get todo', ()=>{

it("should return todos docs",(done)=>{

    request(app)
    .get("/todo")
    .expect(200)
    .expect((res)=>{
            expect(res.body.todos.length).toBe(todosA.length)
        }).end(done)
    })
})


describe('/get todo/:id', ()=>{

    it("should return todos docs",(done)=>{

        request(app)
        .get(`/todo/${todosA[0]._id.toHexString()}`) //toHexString - object to string
        .expect(200)
        .expect((res)=>{
                expect(res.body.todos.text).toBe(todosA[0].text)
            }).end(done)
        })

        it("should return 404 error if todo not found",(done)=>{
            request(app)
            .get(`/todo/${new ObjectID().toHexString()}`)
            .expect(404)
            .expect((res)=>{
                expect(res.body).toEqual({})
            }).end(done)
        })
    
        it("should return 404 error if id is non-object id",(done)=>{
            request(app)
            .get(`/todo/123`)
            .expect(404)
            .expect((res)=>{
                expect(res.body).toEqual({})
            }).end(done)
        })
    })

    describe('PATCH /todo/:id',()=>{
        it('should update the todo',(done)=>{
            var id = todosA[0]._id.toHexString()
            text="Hello world";
            request(app)
            .patch(`/todo/${id}`)
            .send({text, completed:true}) 
            .expect(200)
            .expect((todos)=>{
                expect(todos.body.doc.text).toBe(text)
                expect(todos.body.doc.completed).toEqual(true)
                expect(typeof todos.body.doc.completedAt).toBe('number')            
            }).end(done)
        })
        it('should clear completedAt when todo isnt completed',(done)=>{
            var id = todosA[1]._id.toHexString()
            text="Hello world";
            request(app)
          .patch(`/todo/${id}`) 
          .expect(200)
          .send({completed:false, text})
          .expect((todos)=>{
              expect(todos.body.doc.text).toBe(text)
              expect(todos.body.doc.completed).toEqual(false)
              expect(todos.body.doc.completedAt).toBeNull()
          }).end(done) 
        })
        
    })

 
