const mongoose = require('mongoose')

mongoose.Promise=global.Promise // tell mongoose that we use promises

// mongoose maintanig the connection over time
// this method below connect to our local db or from mLab DB
var mLab = 'mongodb://Roee_R:roi199115@ds161024.mlab.com:61024/test-db'
var localHost = 'mongodb://localhost:27017/TodoApp'
mongoose.connect(process.env.PORT ? mLab : localHost ,{ useNewUrlParser: true })


module.exports={mongoose} // same as module.exports.mongoose=mongoose