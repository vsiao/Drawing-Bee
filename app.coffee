express = require 'express'
redis = require 'redis'
db = redis.createClient()
app = express()
server = require('http').createServer app
io = require('socket.io').listen server

app.use express.logger()
app.use express.static __dirname
app.use app.router

Array::sample = () -> this[Math.floor(Math.random()*this.length)]

words = [
  "derp"
, "fish"
, "cow"
, "apple"
, "coffee"
, "airbnb"
, "greylock"
]

setupWords = (room) ->
  word0 = words.sample()
  word1 = words.sample()

  db.set "drawingbee:#{room}:word0", word0
  db.set "drawingbee:#{room}:word1", word1

io.sockets.on 'connection', (socket) ->
  socket.on 'join', (room, username) ->
    socket.set 'username', username
    socket.set 'room', room

    client_count = io.sockets.clients(room).length

    if client_count < 2
      socket.set 'drawer', client_count
      socket.emit 'playerType', "drawer#{client_count}"
    else
      socket.emit 'playerType', "guesser"

    socket.join room
    socket.emit 'joined',
      count: client_count + 1

  socket.on 'leave', (room) ->
    socket.leave room

  socket.on 'getWord', ->
    socket.get 'room', (err, room) ->
      socket.get 'drawer', (err, drawer) ->
        switch drawer
          when 0, 1
            db.get "drawingbee:#{room}:word", (err, word) ->
              socket.emit 'word', word
          else console.log "error! #{drawer}"

  socket.on 'start', ->
    socket.get 'room', (err, room) ->
      io.sockets.in(room).emit 'started'
      setupWord room

      # tell everyone whose turn it is!
      zeros_turn = true
      setInterval ->
        zeros_turn = !zeros_turn
        io.sockets.in(room).emit 'turn', "drawer#{if zeros_turn then 0 else 1}"
      , 10000

  socket.on 'guess', (guessWord) ->
    socket.get 'room', (err, room) ->
      db.get "drawingbee:#{room}:word", (err, word) ->
          if guessWord == word
              socket.get 'username', (err, username) ->
                io.sockets.in(room).emit 'winner', username,
                  word: word
                db.del "drawingbee:#{room}:word"
            else
              console.log "guessed #{guessWord} incorrectly"

server.listen 3000
console.log "Listening on port 3000"
