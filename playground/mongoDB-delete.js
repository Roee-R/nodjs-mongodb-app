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

    // delete all documents with the name moshe from the collection
    // db.collection('Users').deleteMany({name:"Moshe"}).then((result)=>{
    //     console.log(result)
    // })

    // // delete one random document with the name moshe from the result
    // db.collection('Users').deleteOne({name:"Moshe"}).then((result)=>{
    //     console.log(result)
    // })
    
 // delete one random document and return the result
    // db.collection('Users').findOneAndDelete({location:"Hulon, Israel"}).then((result)=>{
    //     console.log(result)

    // delete document withe id:  document and return the result
    db.collection('Users').findOneAndDelete({_id :124}).then((result)=>{
        console.log(result)

})
})