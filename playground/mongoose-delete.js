const {mongoose} = require('../server/db/mongoose')
const  {user} = require('../server/models/User')
const objectid = require('mongodb').ObjectID

const  {todo} = require('../server/models/Todos')

// todo.remove({}).then((result)=>{
//     console.log(resutlt)
// })


// todo.findOneAndRemove({}).then((todos)=>{
//     console.log(todos)
// })

todo.findByIdAndRemove('5c41c50b368f5b340f42d358').then((todos)=>{
    console.log(todos)
})