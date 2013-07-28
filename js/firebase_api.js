__session = {
  drawing_ref: new Firebase('https://drawingbee.firebaseio.com/drawings'),
  chat_messages: [],
  user_name: 'user ' + Math.floor(Math.random() * 1000),
  room_name: 'roomname',
  setRoomName: function(room_name) {
    this.room_name = room_name;
  },
  setUserName: function(user_name) {
    this.user_name = user_name;
  },
  writeStroke: function(stroke) {
    var room_ref = this.drawing_ref.child(this.room_name);
    room_ref.push({author: this.user_name, stroke: stroke});
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
        this.callback([]);
      }
      room_ref.off();
      room_ref.on('child_added', function(snapshot) {
        this.messages.push(snapshot.val());
        if (this.callback) {
          this.callback(this.messages);
        }
      }.bind(this));
    }
  }
};
