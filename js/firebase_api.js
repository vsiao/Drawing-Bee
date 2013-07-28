__session = {
  chat_ref: new Firebase('https://drawingbee.firebaseio.com/chats'),
  drawing_ref: new Firebase('https://drawingbee.firebaseio.com/drawings'),
  chat_messages: [],
  user_name: 'user ' + Math.floor(Math.random() * 1000),
  room_name: 'roomname',
  setRoomName: function(room_name) {
    this.room_name = room_name;
  },
  writeStroke: function(stroke) {
    var room_ref = this.drawing_ref.child(this.room_name);
    room_ref.push({author: this.user_name, stroke: stroke});
  },
  writeChat: function(text) {
    var room_ref = this.chat_ref.child(this.room_name);
    room_ref.push({author: this.user_name, body: text});
  },
  initialize: function() {
    var roomRef = this.chat_ref.child(this.room_name);
    this.chat_messages = [];
    if (this.callback) {
      this.callback([]);
    }
    roomRef.off();
    roomRef.on('child_added', function(snapshot) {
      this.chat_messages.push(snapshot.val());
      if (this.callback) {
        this.callback(this.chat_messages);
      }
    }.bind(this));
  }
};
