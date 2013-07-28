__session = {
  chat_messages: [],
  user_name: 'user ' + Math.floor(Math.random() * 1000),
  room_name: 'lobby',
  setRoomName: function(room_name) {
    this.room_name = room_name;
  },
  setUserName: function(user_name) {
    this.user_name = user_name;
    this.chat.initialize();
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
      room_ref.push({author: __session.user_name, body: text});
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
