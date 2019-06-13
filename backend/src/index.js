const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')

const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

mongoose.connect('mongodb+srv://luansantos:luansantos@cluster0-pqlh1.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true, 
})

app.use((req, res, next) => {
  req.io = io

  // ALLOW THE NEXT ITEMS TO BE EXECUTED
  next()
})

// ALLOW ANY APP ACCESS THE SERVER
app.use(cors())

// ROUTE FOR FRONT ACCESS IMAGES
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')))

app.use(require('./routes'))

server.listen(3333) 
