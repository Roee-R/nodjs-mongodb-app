var {User} = require('../models/User')

var authenticate = (req,res,next) => {
    var token = req.header('x-auth');

    User.findOneByToken(token).then((user)=>{
        if(!user){
            return Promise.reject()
        }
        req.user= {"_id": user.id, "email":user.email};
        req.token=token;
        next();
    }).catch((e)=>{
        res.status(401).send(console.log({}))
    })
}

module.exports = {authenticate}