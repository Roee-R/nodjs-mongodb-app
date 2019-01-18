const mongoose = require('mongoose')

mongoose.Promise=global.Promise // tell mongoose that we use promises

// mongoose maintanig the connection over time
// this method below connect to our local db or from mLab DB
mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds161144.mlab.com:61144/todo'
|| 'mongodb://localhost:27017/TodoApp' ,{ useNewUrlParser: true })


module.exports={mongoose} // same as module.exports.mongoose=mongoose