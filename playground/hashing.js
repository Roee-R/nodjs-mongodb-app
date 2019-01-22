const {SHA256} = require('crypto-js') // for practise
const jwt = require('jsonwebtoken') // module for web - more friendly

var msg = "Hellow World";
var hash = SHA256(msg).toString();

var data = {
        id: "Asd123"
    }

 var token = jwt.sign(data, 'asddsa') // make a token 

// console.log(token)
 var decoded = jwt.verify(token,'asddsa')  // decode a token to his value

 console.log(`decoded: ${JSON.stringify(decoded)}`);  

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