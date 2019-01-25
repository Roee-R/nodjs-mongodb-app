
var env = process.env.NODE_ENV || 'development';
console.log("********"+env)

var config = require('./config.json'); // read the config json
var envConfig = config[env]; // set the correct config enviroment from env

Object.keys(envConfig).forEach((key)=>{ // get the keys: port and URIDB and more if added
    process.env[key]=envConfig[key] // set process.env keys to there values
})





// if(env==='development'){
//     process.env.PORT = 3000
//     process.env.MONGODB_URI='mongodb://localhost:27017/TodoApp'
// }
// else if(env==='test'){
//     process.env.PORT = 3000
//     process.env.MONGODB_URI='mongodb://127.0.0.1:27017/TodoAppTest'
// }
