const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken') // module for web - more friendly


const {todo} = require('./../../server/models/Todos')
const {User} = require('./../../server/models/User')


// populate functions for users
var userOneObjectId= new ObjectID();
var userTwoObjectId= new ObjectID();
var userThreeObjectId= new ObjectID();

const users = [
{
    _id: userOneObjectId,
    email: 'Hen123@gmail.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({"_id":userOneObjectId, "access": 'auth'},process.env.JWT_SECRET)
    }]
},
{
    _id: userTwoObjectId,
    email: 'haim@gmail.com',
    password: 'userFreePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id:userTwoObjectId, access: 'auth'},process.env.JWT_SECRET)
    }]
}
]


const populateUsers = ((done)=>{
    User.remove({}).then(()=>{
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne,userTwo]) // speacial fired just when all the promises in the array will resolve 
    }).then(()=>done())
})

// populate functions for todos
var todosA = [
    {
    _id : new ObjectID(),
    text: "Hey first test text!@!!",
    creatorId : userOneObjectId   
    },
    {
        _id : new ObjectID(),
        text: "Hey secod test text!@!!",
        completed: true,
        creatorId : userTwoObjectId  
    }];


    const populateTodos = ((done) =>{
 // before each post it removes every text in db with mongoose and insert the todoA array
            todo.remove({}).then(()=>{
                return todo.insertMany(todosA)
            }).then(()=>done()) // ES6 synatx
    })

    module.exports = {populateTodos,todosA,users,populateUsers}











 
