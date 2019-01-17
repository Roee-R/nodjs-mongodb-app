const {mongoose} = require('../server/db/mongoose')
const  {user} = require('../server/models/User')
const objectid = require('mongodb').ObjectID

var id = '5c3e3cb43482dc43502b7f10';

// if(!objectid.isValid(id)){ // check if the id is legaly valid
//     return console.log('Id not valid')
// }


user.findOne().then((users)=>{
    console.log(JSON.stringify(users,undefined,2))
}).catch((e)=>{console.log(e)})

// user.findById(id).then((user)=>{
//     if(!user){
//         return console.log('Id not found') // check if the id is in the collection
//     }
//     console.log('User by id: '+user);
// }).catch((e)=>{console.log(`Ilegal userID ${e}`)}) // check if the id is legaly valid