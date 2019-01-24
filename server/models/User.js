const mongoose = require('mongoose')
const validator = require('validator')
const _ = require('lodash')
const jwt = require('jsonwebtoken') // module for web - more friendly
const bcrypt = require('bcryptjs') //  password hashing module

var userSchema = new mongoose.Schema({ //User is the new collection with methods
    email:{
        type: String,
        required: true, // required varible
        trim: true,
        minlength: 1,
        unique: true, // unique value in collection
        validate: {
            validator: validator.isEmail, // check if the email correct
            message: `{VALUE} is not valid email` // value is verible inside isEmail func
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 8
    },
    // how we access tokens for inviduals user 
    tokens: [{
       access:{
        type: String,
        required: true
       },
       token:{
        type: String,
        required: true
       } 
    }]
}) // its like the model but with methods to

userSchema.methods.getJson = function () { // return just safe data to res.send
    var user = this;
    userObj = user.toObject(); // talking momgose verible and convert to regular objcet
    var body = _.pick(userObj,[`_id`,'email'])
    return body; 
}
userSchema.methods.generateAuthToken = function () { //the reason wenot use arrow function is
    //because they dont have this propties that mean the inividual instance
    var user = this;
    var access = 'auth';
    // generate the token
    var token = jwt.sign({_id: user._id.toHexString()},'abc123').toString()
    user.tokens=user.tokens.concat([{access, token}]) // maby need to replace it with
    // user.tokens.push({access,token})) 
    
    return user.save().then(()=>{ // so we can use then() from serverjs
        return token
    }).catch((e)=>{
        console.log(e)
    })
}


userSchema.methods.removeToken = function (token){
    var user = this;

    return user.update({ // update document
        $pull: { // removes some value of nested varible
            tokens:{token} // like token: token
        }
    })
}
userSchema.statics.findOneByToken = function (token){
    var User = this; //we use User when it static varible
    var decoded;

    try{
        decoded= jwt.verify(token,'abc123');
    }catch (e) {
        return Promise.reject("Failed to decoded") // shorted version of Promise
    }
    return User.findOne({ // look for the user from the token
        '_id':decoded._id, // check for the right id
        'tokens.token': token, // check if the token equel
        'tokens.access': 'auth' // check the access
    })
}

userSchema.statics.findByCredentials = function(email, password){ // find user from the db by providing email and pass
    var User=this;
    return User.findOne({email})
    .then((user)=>{
        if(!user){ //user not exist
            return Promise.reject()
        }
        return new Promise((resolve,reject)=>{ // designed promise because bcrypt not support promises 
            bcrypt.compare(password, user.password, function(err, res) { // check if the pass from the user equel to the hash pass from db
                if (!res){
                     reject() // pass not correct
                }
                else
                {
                    resolve(user)
                }
            })
        })

    })

}
userSchema.pre('save', function (next) { // (middleware function) activated after save functions need to be run and before they actuly executed 
    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt)=>{ 
            bcrypt.hash(user.password,salt, (err, hash)=>{
                user.password = hash; // overide the real pass with the hash password
                next(); 
            })
        })
    }
    else{
        next();
    }
})
var User = mongoose.model('User' ,userSchema) //witouth userSchema: it just model that dont have methods

module.exports={User}