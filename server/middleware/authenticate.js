var {User} = require('../models/User')

var authenticate = (req,res,next) => {
    var token = req.header('x-auth');

    User.findOneByToken(token).then((user)=>{
        if(!user){
            return Promise.reject()
        }
        req.user= {"userid": user.id, "userEmail":user.email};
        req.token=token;
        next();
    }).catch((e)=>{
        res.status(404).send(console.log(e))
    })
}

module.exports = {authenticate}