const mongoClient  = require('mongodb').MongoClient; 
const ObjectID = require('mongodb').ObjectID;


mongoClient.connect('mongodb://localhost:27017/TodoApp',
{ useNewUrlParser: true },(err, client)=>{
    const db = client.db('Todos') // specify the wanted libary
    // we can use db to write and get 
    if(err){
        return console.log('Unable to connect a mongoDB server')
        // return - to prevent other operation to execute or use else
    }
    console.log('Connected to mongoDB server')

    var collection = db.collection('Users')

    collection.findOneAndUpdate({
        _id:new ObjectID("5c3b89a2c2d6883514f7527a")
    },{
       $set:
            {name: "Haim"},
       $inc:       
            {age:1}    
        }
        
    ,{
        returnOriginal: false
    }).then((result)=>{
        console.log(result)
    })
})