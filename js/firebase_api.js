__session = {
  chat_messages: [],
  user_name: 'user ' + Math.floor(Math.random() * 1000),
  room_name: 'lobby',
  player_type: null,
  game_position: 'not_playing',
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
  },
  getRoomName: function() {
    return this.room_name;
  },
  setUserName: function(user_name) {
    this.user_name = user_name;
  },
  getUserName: function() {
    return this.user_name;
  },
  canvas: {
    drawing_ref: new Firebase('https://drawingbee.firebaseio.com/drawings'),
    startStroke: function(coords) {
      var me = this;
      var room_ref = this.drawing_ref.child(__session.room_name);
      var new_stroke_ref = room_ref.push();
      console.log(" **** starting @[" + coords.x + ", " + coords.y + "] **** ");
      new_stroke_ref.push(coords);
      return new_stroke_ref;
    },
    addToStroke: function(coords, stroke_ref) {
      console.log(" **** moving to [" + coords.x + ", " + coords.y + "] **** ");
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
    initialize: function(GameConsole) {
      var me = this;
      var render = function() {
        React.renderComponent(
          GameConsole({
            onSelectUsername: function(name) {
              __session.setUserName(name);
              render();
            },
            onSelectRoom: function(room) {
              __session.setRoomName(room);
              render();
            },
            username: __session.getUserName(),
            room: __session.getRoomName(),
          }),
          document.getElementById('react_game_console')
        );
      };
      render();

      __session.socket.on('started', function() {
        if (__session.player_type == 'drawer0' || __session.player_type == 'drawer1') {
          __session.socket.on('word', function(word) {
            console.log("word: " + word);
            // do something with the word!
          });
          __session.socket.emit('getWord');
        }
      });

      __session.socket.on('winner', function(winner) {
        console.log("winner: " + winner);
        // do something with winner!
      });
    },
    join: function(room_name) {
      __session.socket.on('playerType', function(type) {
        __session.player_type = type;
      });
      // on joined, count >= 3, enable button, on count < 3, disable button
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
    initialize: function(ChatSidebar) {
      var messages = [];
      var room_ref = new Firebase(
          'https://drawingbee.firebaseio.com/chats/' + __session.room_name);
      var render = function(messages) {
        React.renderComponent(
          ChatSidebar({
            messages: messages,
            onSubmitMessage: function(message) {
              room_ref.push({author: __session.getUserName(), body: message});
            }
          }),
          document.getElementById('react_sidebar')
        );
      };
      render([]);
      room_ref.off();
      room_ref.on('child_added', function(snapshot) {
        messages.push(snapshot.val());
        render(messages);
      });
    }
  }
};
