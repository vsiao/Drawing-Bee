express = require 'express'
redis = require 'redis'
db = redis.createClient('6379', 'nodejitsudb5720544143.redis.irstack.com')
db.auth('nodejitsudb5720544143.redis.irstack.com:f327cfe980c971946e80b8e975fbebb4')
app = express()
server = require('http').createServer app
io = require('socket.io').listen server

app.use express.logger()
app.use express.static __dirname
app.use app.router

Array::sample = () -> this[Math.floor(Math.random()*this.length)]
Array::sample_n = (n) ->
  [].concat.apply [], (this.splice(Math.random()*this.length,1) for i in [1..n])
Array::diff = (arr) ->
  this.filter (i) -> !(arr.indexOf(i) > -1)

words = [
  "derp"
, "fish"
, "cow"
, "apple"
, "coffee"
, "airbnb"
, "greylock"
]

setupWord = (room) ->
  word = words.sample()
  db.set "drawingbee:#{room}:word", word

io.sockets.on 'connection', (socket) ->
  socket.on 'join', (room, username) ->
    socket.set 'username', username
    socket.set 'room', room

    socket.join room

    db.get "drawingbee:#{room}:in_progress", (err, in_progress) ->
      socket.emit 'playerType', 'guesser' if in_progress

    io.sockets.in(room).emit 'players',
      count: io.sockets.clients(room).length

  socket.on 'leave', (room) ->
    socket.leave room

    io.sockets.in(room).emit 'players',
      count: io.sockets.clients(room).length

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
      db.set "drawingbee:#{room}:in_progress", true

      sockets = io.sockets.clients(room)
      drawers = sockets.sample_n 2
      guessers = sockets.diff drawers

      # tell everyone what they are
      for d, i in drawers
        d.emit 'playerType', "drawer#{i}"
        d.set 'drawer', i

      g.emit 'playerType', 'guesser' for g in guessers

      # tell everyone whose turn it is!
      zeros_turn = true
      give_turns = ->
        zeros_turn = !zeros_turn
        io.sockets.in(room).emit 'turn', "drawer#{if zeros_turn then 0 else 1}"
      give_turns()
      setInterval give_turns, 5000

  socket.on 'guess', (guessWord) ->
    socket.get 'room', (err, room) ->
      db.get "drawingbee:#{room}:word", (err, word) ->
          if guessWord == word
              socket.get 'username', (err, username) ->
                io.sockets.in(room).emit 'winner', username, word
                db.del "drawingbee:#{room}:in_progress"
                db.del "drawingbee:#{room}:word"
            else
              console.log "guessed #{guessWord} incorrectly"

  socket.on 'disconnect', ->
    socket.get 'room', (err, room) ->
      io.sockets.in(room).emit 'players',
        count: io.sockets.clients(room).length - 1


server.listen 3000
console.log "Listening on port 3000"
