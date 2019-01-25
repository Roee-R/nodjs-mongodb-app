const mongoose = require('mongoose')

// todos model - schema for Todos table (validate args)
var todo = mongoose.model('Todos', { //Todos is the new collection
    text:{
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    completed:{
        type: Boolean,
        default: false
    },
    completedAt:{
        type: Number,
        default: null
    },
    creatorId:{
        required: true,
        type: mongoose.Schema.Types.ObjectId
    }
})

module.exports={todo}