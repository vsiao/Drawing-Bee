__session = {
  chat_messages: [],
  user_name: 'user ' + Math.floor(Math.random() * 1000),
  room_name: 'lobby',
  player_type: null,
  num_players: 0,
  setRoomName: function(room_name) {
    var old_room_name = this.room_name;
    if (room_name != 'lobby') {
      this.game.join(room_name);
    }
    if (old_room_name != 'lobby') {
      this.game.leave(old_room_name);
    }
    this.room_name = room_name;
    this.canvas.refresh();
    this.chat.initialize(ChatSidebar);
    this.game.renderConsole();
  },
  getRoomName: function() {
    return this.room_name;
  },
  setUserName: function(user_name) {
    this.user_name = user_name;
    this.game.renderConsole();
  },
  getUserName: function() {
    return this.user_name;
  },
  setWord: function() {

  },
  clearWord: function() {

  },
  canvas: {
    drawing_ref: new Firebase('https://drawingbee.firebaseio.com/drawings'),
    startStroke: function(coords) {
      var me = this;
      var room_ref = this.drawing_ref.child(__session.room_name);
      var new_stroke_ref = room_ref.push();
      new_stroke_ref.push(coords);
      return new_stroke_ref;
    },
    addToStroke: function(coords, stroke_ref) {
      stroke_ref.push(coords);
    },
    refresh: function() {
      this.canvas.clear();
      var room_ref = this.drawing_ref.child(__session.room_name);
      room_ref.off();
      // Initialize by loading all strokes in this room
      room_ref.on('child_added', function(stroke_thing) {
        stroke_thing.ref().on('child_added', function(coord_thing, prev_coord) {
          if (!prev_coord) {
            Canvas.startStroke(coord_thing.val());
          } else {
            Canvas.moveStroke(coord_thing.val());
          }
        });
      });
    },
    initialize: function(Canvas) {
      this.canvas = Canvas;
      this.refresh();
    }
  },
  game: {
    renderConsole: function() {
      React.renderComponent(
        GameConsole({
          onSelectUsername: function(name) {
            __session.setUserName(name);
          },
          onSelectRoom: function(room) {
            __session.setRoomName(room);
          },
          onStartGame: function() {
            __session.socket.emit('start');
          },
          username: __session.getUserName(),
          room: __session.getRoomName(),
          waiting_to_start: __session.getRoomName() !== "lobby",
          num_players: __session.num_players
        }),
        document.getElementById('react_game_console')
      );
    },
    initialize: function(GameConsole) {
      var me = this;
      this.renderConsole();

      __session.socket.on('started', function() {
        if (__session.player_type == 'drawer0' || __session.player_type == 'drawer1') {
          __session.socket.on('word', function(word) {
            __session.setWord(word);
          });
          __session.socket.emit('getWord');
        }
      });

      __session.socket.on('playerType', function(type) {
        __session.player_type = type;
      });
      // on joined, count >= 3, enable button, on count < 3, disable button

      __session.socket.on('winner', function(winner) {
        console.log("winner: " + winner);
        // do something with winner!
        __session.clearWord();
      });

      __session.socket.on('players', function(data) {
        __session.num_players = data.count;
        me.renderConsole();
      });
    },
    join: function(room_name) {
      __session.socket.emit('join', room_name, __session.user_name);
      
    },
    leave: function(room_name) {
      __session.socket.emit('leave', room_name);
    },
    guess: function(guess_word) {
      __session.socket.emit('guess', guess_word);
    }
  },
  chat: {
    room_ref: null,
    initialize: function(ChatSidebar) {
      var messages = [],
          me = this;
      if (this.room_ref) {
        this.room_ref.off();
      }
      this.room_ref = new Firebase(
          'https://drawingbee.firebaseio.com/chats/' + __session.room_name);
      var render = function(messages) {
        React.renderComponent(
          ChatSidebar({
            messages: messages,
            onSubmitMessage: function(message) {
              me.room_ref.push({author: __session.getUserName(), body: message});
              __session.game.guess(message);
            }
          }),
          document.getElementById('react_sidebar')
        );
      };
      render([]);
      this.room_ref.on('child_added', function(snapshot) {
        var message = snapshot.val();
        message.onRemove = function() {
          snapshot.ref().remove();
          messages.splice(messages.indexOf(message), 1);
          render(messages);
        };
        messages.push(message);
        render(messages);
      });
    }
  }
};
