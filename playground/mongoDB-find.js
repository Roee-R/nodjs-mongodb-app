const mongoClient  = require('mongodb').MongoClient; 
const ObjectID = require('mongodb').ObjectID


mongoClient.connect('mongodb://localhost:27017/TodoApp',
{ useNewUrlParser: true },(err, client)=>{
    const db = client.db('Todos') // specify the wanted libary
    // we can use db to write and get 
    if(err){
        return console.log('Unable to connect a mongoDB server')
        // return - to prevent other operation to execute or use else
    }
    console.log('Connected to mongoDB server')

    // // search for document with the objectID=5c3b89a2c2d6883514f7527a
    // db.collection('Users').find({
    //     _id : new ObjectID('5c3b89a2c2d6883514f7527a')
    // }).toArray().then((docs)=>{
    //     console.log(JSON.stringify(docs,undefined,2))
    // }, (err)=>{
    //     console.log("Unable to find in Todos " + err)
    // })

    // search for document with the name = "moshe"
    // db.collection('Users').find({name:"Moshe"}).toArray().then((docs)=>{
    //     console.log(JSON.stringify(docs,undefined,2))
    // }, (err)=>{
    //     console.log("Unable to find in Todos " + err)
    // })

    //     // Count the documents with the name = "moshe"
    // db.collection('Users').count({name:"Moshe"}).then((count)=>{
    //     console.log(`The Number of ducuments for Moshe is ${count}`)
    // }, (err)=>{
    //     console.log("Unable to count in Todos " + err)
    // })

var query = db.collection('Users').find()
.hint( 'age_1' ).toArray().then((docs)=>{
        console.log(JSON.stringify(docs,undefined,2))
    }, (err)=>{
        console.log("Unable to find in Todos " + err)
    })
console.log(query)
// console.log(db.collection('Users').getIndexes())
 })