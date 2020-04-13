// Config API
const express = require('express')
const app = express()
const port = 2020

let input = "28"
let inputInt = parseInt(input)

// Agar dapat menerima object saat post (req.body)
app.use(express.json())

// Config MongoDB
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const URL = 'mongodb://127.0.0.1:27017'
const database = 'API-MongoDB'

// Koneksi ke MongoDB
MongoClient.connect(URL, {useNewUrlParser : true, useUnifiedTopology: true}, (err, client) => {

   // Jika terdapat error, 'err' akan berisi object error, dan kemudian memunculkan teks di console
   if(err){
      return console.log('Gagal terkoneksi dengan MongoDB')
   }

   console.log('Berhasil terkoneksi dengan MongoDB')

   // Menentukan database mana yang akan digunakan
   const db = client.db(database)

   app.get('/', (req, res) => {
      res.send(
         '<h1>Welcome to my Home</h1>'
      )
   })

   // CREATE ONE USER
   app.post('/users', (req, res) => {
      // Mengambil property name dan age dari req.body
      const {name, age} = req.body

      db.collection('users').insertOne({name, age})
         .then((resp) => {
            res.send({
               id : resp.insertedId,
               user: resp.ops[0]
            })
         })


   })

   // GET ONE USER
   app.get('/findone', (req, res) => {
      // req.query = {usia :  "28", nama: "Andri"}

      // Data yang dikirim saat proses GET akan dianggap sebagai string
      let usia = parseInt(req.query.usia)

      // Mencari satu data berdasarkan umurnya
      db.collection('users').findOne({age: usia})
         .then((resp) => {

            res.send(resp)

         })
         
   })


   // GET MANY USERS
   app.get('/find', (req, res) => {

      let usia = parseInt(req.query.usia)
      
      // Mencari lebih dari satu data berdasarkan umurnya
      db.collection('users').find({age : usia}).toArray()
         .then((resp) => {
            res.send(resp)
         })

   })

   // GET ALL USERS
   app.get('/alluser', (req, res) => {

      db.collection('users').find({}).toArray()
         .then((resp) => {
            res.send( resp )
         })

   })

   // DELETE BY NAME
   app.delete('/user/:name', (req, res) => {
      let name = req.params.name

      db.collection('users').deleteOne({ name })
         .then((resp) => {
            res.send( resp )
         })
   })

            

})

// Running API
app.listen(port, () => { console.log('API running at port ' + port) })