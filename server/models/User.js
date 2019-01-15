const mongoose = require('mongoose')


var user = mongoose.model('User' ,{ //User is the new collection
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
})

module.exports={user}