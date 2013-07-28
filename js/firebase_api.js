__session = {
  chatRef: new Firebase('https://drawingbee.firebaseio.com/chats'),
  drawingRef: new Firebase('https://drawingbee.firebaseio.com/drawings'),
  chatMessages: [],
  userName: 'username' + Math.floor(Math.random() * 1000),
  roomName: 'roomname',
  writeStroke: function(stroke) {
    var room_ref = this.drawingRef.child(this.roomName);
    room_ref.push({author: this.userName, stroke: stroke});
  },
  writeChat: function(text) {
    var room_ref = this.chatRef.child(this.roomName);
    room_ref.push({author: this.userName, body: text});
  },
  initialize: function() {
    this.chatMessages = [];
    if (this.callback) {
      this.callback([]);
    }
    this.chatRef.child(this.roomName).on('child_added', function(snapshot) {
      this.chatMessages.push(snapshot.val());
      if (this.callback) {
        this.callback(this.chatMessages);
      }
    }.bind(this));
  }
};
