// Config API
const express = require('express')
const app = express()
const port = 2020

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

   // Menentukan database mana yang akan digunakan
   const db = client.db(database)

   app.get('/', (req, res) => {
      res.send(
         '<h1>Welcom to my Home</h1>'
      )
   })

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


})

// Running API
app.listen(port, () => { console.log('API running at port ' + port) })