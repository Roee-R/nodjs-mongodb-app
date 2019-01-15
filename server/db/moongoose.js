const mongoose = require('mongoose')

mongoose.Promise=global.Promise // tell mongoose that we use promises

// mongoose maintanig the connection over time
mongoose.connect('mongodb://localhost:27017/TodoApp',{ useNewUrlParser: true })


module.exports={mongoose} // same as module.exports.mongoose=mongoose