const mongoClient  = require('mongodb').MongoClient; 
const ObjectID = require('mongodb').ObjectID

// ObjectID class 
// var obj = new ObjectID()
// console.log(obj)

// A feature of jsES6 Object destructuring
// var user = {name: "Yosi", age: 24}
// var {name,age} = user
// console.log({user}.name)


// connect to DB with our local host, port in the robomongo, 
// with db we want to connect to
// the mongoClientc create the ToDoApp db file automatcly  
mongoClient.connect('mongodb://localhost:27017/TodoApp',
{ useNewUrlParser: true },(err, client)=>{
    const db = client.db('Todos') // specify the wanted DB name
    // we can use db to write and get 
    if(err){
        return console.log('Unable to connect a mongoDB server')
        // return - to prevent other operation to execute or use else
    }
    console.log('Connected to mongoDB server')

    db.collection('Todos').insertOne({
        msg: "Hello World!",
        complete: true
    }, (err, result)=>{
        if(err){
            return console.log('Unable to make Todos insert :'+err)
        }
        console.log(JSON.stringify(result.ops,undefined,2))
    })

    db.collection('Users').insertOne({
        // _id: 123 replace the default id with costume id
        name: "Moshe",
        age: 43,
        location: "Hulon, Israel"
    },(err,result)=>{
        if(err){
           return console.log('Unable to make Users insert :'+err)
        }
        console.log(JSON.stringify(result.ops,undefined,2))
        // console.log(result.ops[0]._id.getTimestamp())
        // this return the date that the _id was created
    })
    client.close();
})