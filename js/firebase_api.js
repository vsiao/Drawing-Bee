__session = {
  chat_messages: [],
  user_name: 'user ' + Math.floor(Math.random() * 1000),
  room_name: 'lobby',
  game_position: 'not_playing',
  setRoomName: function(room_name) {
    this.room.join(room_name);
    this.room_name = room_name;
    this.chat.initialize();
  },
  setUserName: function(user_name) {
    this.user_name = user_name;
    this.chat.initialize();
  },
  getUserName: function() {
    return this.user_name;
  },
  room: {
    join: function(room_name) {
      // TODO put something here
    },
    startGame: function() {
      // TODO put something here
    },
    setCallback: function(callback) {
      // TODO put something here
    }
  },
  canvas: {
    drawing_ref: new Firebase('https://drawingbee.firebaseio.com/drawings'),
    startStroke: function(coords) {
      var room_ref = this.drawing_ref.child(this.room_name),
          new_stroke_ref = room_ref.push();
      new_stroke_ref.push(coords);
      return new_stroke_ref;
    },
    addToStroke: function(coords, stroke_ref) {
      stroke_ref.push(coords);
    },
    finishStroke: function(coords, stroke_ref) {
      stroke_ref.push(coords);
    },
    setCallback: function(callback) {
      this.callback = callback;
      this.initialize();
    },
    initialize: function() {
      var room_ref = this.drawing_ref.child(__session.room_name);
      room_ref.off();
      room_ref.on('child_added', function(snapshot) {
        if (this.callback) {
          this.callback(snapshot.val());
        }
      }.bind(this));
    }
  },
  chat: {
    chat_ref: new Firebase('https://drawingbee.firebaseio.com/chats'),
    setCallback: function(callback) {
      this.callback = callback;
      this.initialize();
    },
    write: function(text) {
      var room_ref = this.chat_ref.child(__session.room_name);
      room_ref.push({author: __session.getUserName(), body: text});
    },
    initialize: function() {
      var room_ref = this.chat_ref.child(__session.room_name);
      this.messages = [];
      if (this.callback) {
        this.callback({messages: []});
      }
      room_ref.off();
      room_ref.on('child_added', function(snapshot) {
        this.messages.push(snapshot.val());
        if (this.callback) {
          this.callback({messages: this.messages});
        }
      }.bind(this));
    }
  }
};
