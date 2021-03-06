const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')


const {app} = require('./../server/server'); // destracture use, import the verible "app"
const {todo} = require('./../server/models/Todos');
const {User} = require('./../server/models/User');

const {populateTodos, todosA, users,populateUsers} 
= require('./seed/seed'); // insert data into the test DB

beforeEach(populateUsers); // make the insert
beforeEach(populateTodos); // make the insert

describe('/post todo', ()=>{
    it('should create new todo',(done)=>{
        var text = "Some new todo"
// all checks for sending post
        request(app)
        .post('/todo')
        .set('x-auth', users[0].tokens[0].token)
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text) // check if the text from the post are the text we added
        }).end((err,res)=>{ // function to check if the value is saved in DB
            if(err){
                return done(err)
            }
            todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1) // check in moongose/todos if there is one text (that we send here)
                expect(todos[0].text).toBe(text) // check in moongose/todos if the value is our value (that we send here)
                done() // end the process
            }).catch((e)=>done(e)) // if one of above failed
           
        })
    })


    it('should not create with invalid data',(done)=>{
// all checks for sending post
        request(app)
        .post('/todo')
        .set('x-auth', users[0].tokens[0].token)
        .send({})
        .expect(400)
        .end((err,res)=>{ // function to check if the value is saved in DB
            if(err){
                return done(err)
            }
            else{
                todo.find().then((todos)=>{
                    expect(todos.length).toBe(todosA.length) // check in moongose/todos if there is one text (that we send here)
                    done() // end the process
                }).catch((e)=>done(e)) // if one of above failed
            }
        })
    })
})


describe('/get todo', ()=>{

it("should return todos docs",(done)=>{

    request(app)
    .get("/todo")
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
            expect(res.body.todos.length).toBe(1)
        }).end(done)
    })
})


describe('/get todo/:id', ()=>{

    it("should return todos docs",(done)=>{
        request(app)
        .get(`/todo/${todosA[0]._id.toHexString()}`) //toHexString - object to string
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
                expect(res.body.todos.text).toBe(todosA[0].text)
            }).end(done)
        })

        it("should not return todos docs made by other creator",(done)=>{
            request(app)
            .get(`/todo/${todosA[1]._id.toHexString()}`) //toHexString - object to string
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
            })

        it("should return 404 error if todo not found",(done)=>{
            request(app)
            .get(`/todo/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .expect((res)=>{
                expect(res.body).toEqual({})
            }).end(done)
        })
    
        it("should return 404 error if id is non-object id",(done)=>{
            request(app)
            .get(`/todo/123`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .expect((res)=>{
                expect(res.body).toEqual({})
            }).end(done)
        })
    })

    describe('DELETE /todos/:id', () => {
        it('should remove a todo', (done) => {
            var hexId = todosA[1]._id.toHexString();
            request(app)
            .delete(`/todo/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(hexId)
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                todo.findById(hexId).then((todo)=>{
                    expect(todo).not.toBeTruthy()
                    done()
                }).catch((e)=>done(e))
            })
        });

        it('should not remove a todo', (done) => {
            var hexId = todosA[0]._id.toHexString();
            request(app)
            .delete(`/todo/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                todo.findById(hexId).then((todo)=>{
                    expect(todo).toBeTruthy()
                    done()
                }).catch((e)=>done(e))
            })
        });
      
        // it('should return 404 if todo not found', (done) => {

        // });
      
        // it('should return 404 if object id is invalid', (done) => {
        // });
      });
      
    describe('PATCH /todo/:id',()=>{
        it('should update the todo',(done)=>{
            var id = todosA[0]._id.toHexString()
            text="Hello world";
            request(app)
            .patch(`/todo/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({text, completed:true}) 
            .expect(200)
            .expect((todos)=>{
                expect(todos.body.doc.text).toBe(text)
                expect(todos.body.doc.completed).toEqual(true)
                expect(typeof todos.body.doc.completedAt).toBe('number')            
            }).end(done)
        })

        it('should not update the todo if todo not related to user',(done)=>{
            var id = todosA[0]._id.toHexString()
            text="Hello world";
            request(app)
            .patch(`/todo/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({text, completed:true}) 
            .expect(404)
            .end(done)
        })


        it('should clear completedAt when todo isnt completed',(done)=>{
            var id = todosA[1]._id.toHexString()
            text="Hello world";
            request(app)
          .patch(`/todo/${id}`)
          .set('x-auth', users[1].tokens[0].token) 
          .expect(200)
          .send({completed:false, text})
          .expect((todos)=>{
              expect(todos.body.doc.text).toBe(text)
              expect(todos.body.doc.completed).toEqual(false)
              expect(todos.body.doc.completedAt).toBeNull()
          }).end(done) 
        })
        
    })

    describe('GET users/me',()=>{
        it('should return user if authenticated',(done)=>{
            request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token) // set for the header
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
        }),

        it('should return 401 if not authenticated',(done)=>{
            request(app)
            .get('/users/me')
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({})
            })
            .end(done);
        })
    })

    describe('POST /users',()=>{
        
        it('should create a new user',(done)=>{
            var email = 'yosi123@gmail.com';
            var password = 'asd12345';

            request(app)
            .post('/users')
            .send({email,password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers).toHaveProperty(['x-auth']);
                expect(res.body.email).toBe(email);
                expect(res.body).toHaveProperty('_id');
            })
            .end((err)=>{
                if(err){
                    return done(err);
                }
                User.findOne({email}).then((user)=>{
                    expect(user).toHaveProperty('email',email);
                    expect(user).not.toHaveProperty('password',password);
                    done();
                }).catch((e)=>done(e))
            })
        })
        
        it('should return validation error if request invalid',(done)=>{
            var password = 'asd';
            var email = 'yosi123gmail.com'

            request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .end(done) 
        })

       
        it('should not create a user if email in use',(done)=>{
            request(app)
            .post('/users')
            .send({email:users[1].email, password:123123123})
            .expect(400)
            .end(done)
        })
       
    })

    

describe('POST /users/login', ()=>{
    it('should login user and return token',(done)=>{
            
        request(app)
        .post('/users/login')
        .send({email: users[0].email , password: users[0].password}) // send the username from the seed.js user array
        .expect(200)
        .expect((res)=>{
            expect(res.headers).toHaveProperty(['x-auth']); // check if header x-auth is set
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }

            User.findById(users[0]._id).then((user)=>{
                expect(user.tokens[1]).toHaveProperty('access','auth') //use the second place in array because we loggoded again
                expect(user.tokens[1]).toHaveProperty('token',res.headers['x-auth'])
                done();
            }).catch((e)=>done(e));
        })
    })

    
    it('should reject invalid login',(done)=>{
        request(app)
        .post('/users/login')
        .send({
            email: users[0].email,
            password: 'asdasdwqasf'
        })
        .expect(400)
        .expect((res)=>{
            expect(res.headers).not.toHaveProperty(['x-auth']); // check if header x-auth is set
        })
        .end((err,res)=>{
            if(err){
                return done(err)
            }
            User.findById(users[0]._id).then((user)=>{
                expect(user.tokens.length).toBe(1);
                done();
            }).catch((e)=>done(e))

        })
    })
})

describe('DELETE users/me/token', ()=>{
    it('should remove auth token on logut', (done)=>{
        request(app)
        .delete('/users/me/token')
        .set('x-auth', users[0].tokens[0].token)  
        .expect(200) 
        .end((err,res)=>{
            if(err){
                return done(err)
            }
            User.findById(users[0]._id).then((user)=>{
                expect(user.tokens.length).toBe(0)
                done()
            }).catch((e)=>done(e))
        })
    })
})