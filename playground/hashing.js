const {SHA256} = require('crypto-js') // for practise token crpyto
const jwt = require('jsonwebtoken') // module for web - more friendly
const bcryptjs = require('bcryptjs') //  password hashing module

// bcrpyt commands

var password = 'asdqwe123';

// bcryptjs.genSalt(10, (err, salt)=>{ // rounds(10)=the cost of processing the data. (default - 10) as much as the number bigger the process longer and a more protected password

//     bcryptjs.hash(password,salt, (err, hash)=>{
//         console.log(hash) // hash is the argument wa want to store in the DB
//     })
// })

// console:
// C:\Users\roi\Desktop\nodejs\node-todo-api>node playground/hashing.js
// $2a$10$rwbhuEz2iFzpXrOw9a8zI.7clKD4j11KoEYF5bXUx6CoTLUf2MARi

var hashedPass = '$2a$10$R2DTwFupQwE8ZIOnrYSGl.UE638etybkTuNk1guHdGuY/8.3Qoyga'
var hashedPass1 = '$2a$10$ldRXJAckCWQq2SkpDnPA4eMrizLfInxeM71Fe.d4GKaj2GLHHsQ4u'


bcrypt.compare(password, hashedPass, function(err, res) {
    console.log(`pass: ${password} First hash pass --${hashedPass}-- is ${res}`)
});

bcrypt.compare(password, hashedPass1, function(err, res) {
    console.log(`pass: ${password} Second hash pass --${hashedPass1}-- is ${res}`)
});

// console:
// pass: asdqwe123 First hash pass --$2a$10$R2DTwFupQwE8ZIOnrYSGl.UE638etybkTuNk1guHdGuY/8.3Qoyga-- is true
// pass: asdqwe123 Second hash pass --$2a$10$ldRXJAckCWQq2SkpDnPA4eMrizLfInxeM71Fe.d4GKaj2GLHHsQ4u-- is true

// jwt (jsonwebtoken) commands and SHA256(crypto-js)
// JSON Web Token is a standard used to create access tokens for an application. It works this way: the server generates a token that certifies the user identity, and sends it to the client

// var msg = "Hellow World";
// var hash = SHA256(msg).toString();

// var data = {
//         id: "Asd123"
//     }

//  var token = jwt.sign(data, 'asddsa') // make a token from id object and some secret

// console.log(token)
//  var decoded = jwt.verify(token,'asddsa')  // decode a token to his value

//  console.log(`decoded: ${JSON.stringify(decoded)}`);  

// console.log(`Message is: ${msg}`, `hash is: ${hash}`)

// var data = {
//     id: 123
// }

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data)+'secret text').toString()
// }

// the hashing not complete becuse we can change the hush propety using below code:
// token.data.id =114;
// token.hash = SHA256(JSON.stringify(token.data).toString())

// console.log(`new token.data : ${token.data.id}`,`new token.hash: ${token.hash}`)

// // the solution is using secret text like above, and the code below


// var resultHash = SHA256(JSON.stringify(token.data)+'secret text').toString();

// if(resultHash===token.hash){
//     console.log("No change in token hash and id")
// }
// else{
//     console.log("Data was corrupted, do not use it!")
// }