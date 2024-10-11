const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

//middleware 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) =>{
   res.send('My server is running...')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ewhtdrn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

   const usersCollection = client.db('usersDB').collection('users')

   app.get('/users', async(req, res) =>{
      const result = await usersCollection.find().toArray()
      res.send(result)
   })

   app.post('/users', async(req, res) =>{
      const user = req.body;
      const result = await usersCollection.insertOne(user)
      res.send(result)
   })

   app.delete('/users/:id', async(req, res) =>{
      const id = req.params.id;
      console.log(id)
      const query = {_id : new ObjectId(id)}
      const result = await usersCollection.deleteOne(query)
      res.send(result)
   })
   
    
    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } finally {
    //
  }
}
run().catch(console.dir);



app.listen(port, () =>{
   console.log('My server is running..', port);
})