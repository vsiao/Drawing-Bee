__session = {
  chat_messages: [],
  user_name: 'user ' + Math.floor(Math.random() * 1000),
  room_name: 'lobby',
  game_position: 'not_playing',
  setRoomName: function(room_name) {
    if (room_name != 'lobby') {
      this.game.join(room_name);
    }
    this.room_name = room_name;
    this.chat.initialize();
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
      new_stroke_ref.on('child_added', function(snapshot) {
        me.canvas.moveStroke(snapshot.val());
      });
      me.canvas.startStroke(coords);
      return new_stroke_ref;
    },
    addToStroke: function(coords, stroke_ref) {
      console.log(" **** moving to [" + coords.x + ", " + coords.y + "] **** ");
      stroke_ref.push(coords);
    },
    initialize: function(Canvas) {
      this.canvas = Canvas;
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
        Canvas.endStroke();
      });
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
            onSelectRoom: function() {
            },
            username: __session.getUserName(),
            room: '',
          }),
          document.getElementById('react_game_console')
        );
      };
      render();
    },
    join: function(room_name) {
      // TODO put something here I guess
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
