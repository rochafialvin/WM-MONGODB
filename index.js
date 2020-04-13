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
      let {name, age} = req.body
      // name : 32
      // age : "Susi"

      name = parseInt(name) // 32
      age = parseInt(age) // NaN

      // ideal , name = NaN , age = number
      
      if(isNaN(name) && !isNaN(age)){ // Jika user input dengan benar
         db.collection('users').insertOne({name, age})
         .then((resp) => { // Jika berhasil melakukan insertOne
            res.send({
               id : resp.insertedId,
               user: resp.ops[0]
            })
         }).catch((err) => { // Jika gagal melakukan insertOne , masalah server

            res.send(err)
         })
      } else { // Jika terjadi kesalahan input user
         res.send({
            error_message : "Inputan Anda salah"
         })
      }
      
   })

   // READ ONE USER
   app.get('/findone', (req, res) => {
      // req.query = {age :  "28", nama: "Andri"}

      // Data yang dikirim saat proses GET akan dianggap sebagai string
      let age = parseInt(req.query.age)

      if(!isNaN(age)){ // Jika user input dengan benar

         // Mencari satu data berdasarkan umurnya
         db.collection('users').findOne({age})
         .then((resp) => { // Jika berhasil menjalankan findOne

            res.send(resp)

         }).catch((err) => { // Jika terjadi kegagalan proses findOne, masalah server
            res.send(err)
         })
      } else { // Jika terjadi kesalahan input user
         res.send({
            error_message : "Inputan Anda salah"
         })
      }


         
   })


   // READ MANY USERS
   app.get('/find', (req, res) => {

      let usia=  parseInt(req.query.usia)

      if(!isNaN(usia)) { // Jika user input data dengan benar
         // Mencari lebih dari satu data berdasarkan umurnya
         db.collection('users').find({age : usia}).toArray()
         .then((resp) => { // Jika berhasil melakukan find
            res.send(resp)

         }).catch((err) => { // Jika terjadi masalah dengan server, akan mengirim object error
            
            res.send(err)

         })

      } else { // Jika terjadi kesalahan input oleh user, makan akan mengirimkan object info
         
         res.send({
            error_message : "Inputan Anda salah"
         })
      }
      
      
   })

   // READ ALL USERS
   app.get('/alluser', (req, res) => {

      db.collection('users').find({}).toArray()
         .then((resp) => {
            res.send( resp )

         }).catch((err) => { // Jika gagal menjalankan find
            res.send(err.name)

         })

   })

   // UPDATE BY NAME
   app.patch('/user/:name', (req, res) => {
      let name = req.params.name // Demian
      let newName = req.body.newname // Deny

      name = parseInt(name)
      newName = parseInt(newName)

      if(isNaN(name) && isNaN(newName)){ // Jika user input data dengan benar

         name = name[0].toUpperCase() + name.slice(1)

         db.collection('users').updateOne({ name }, { $set : {name: newName} })
            .then((resp) => { // Jika berhasil menjalankan updateOne
               res.send({
                  banyak_data : resp.modifiedCount
               })
            }).catch((err) => { // Jika gagal menjalankan updateOne
               res.send(err)
            })
      } else { // Jika terjadi kesalahan input user
         res.send({
            error_message : "Inputan Anda salah"
         })
      }

      
   })

   // DELETE BY NAME
   app.delete('/user/:name', (req, res) => {
      // req.params karena kita menambahkan variable pada path / link
      let name = req.params.name

      name = parseInt(name)

      if(isNaN(name)){ // Jika input user benar
         // Agar karakter pertama pada nama akan menjadi huruf besar (capital)
         name = name[0].toUpperCase() + name.slice(1)

         db.collection('users').deleteOne({ name })
            .then((resp) => { // Jika berhasil menjalankan deleteOne
               res.send( resp )

            }).catch((err) => { // Jika gagal menjalankan deleteOne
               res.send(err)

            })

      } else { // Jika terjadi kesalahan input user
         res.send({
            error_message : "Inputan Anda salah"
         })
      }

   })

})

// Running API
app.listen(port, () => { console.log('API running at port ' + port) })

// {
//    error_message : "Inputan Anda salah"
// }