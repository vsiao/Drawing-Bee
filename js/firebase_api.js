function getRoomName() {
  return 'a_room_name';
}
function getUserName() {
  return 'donald'
}
FB = {
  chatRef: new Firebase('https://drawingbee.firebaseio.com/chats'),
  drawingRef: new Firebase('https://drawingbee.firebaseio.com/drawings'),
  chatMessages: [],
  writeChat: function(text) {
    var room_name = getRoomName(),
        user_name = getUserName(),
        room_ref = this.chatRef.child(room_name);
    room_ref.push({author: user_name, body: text});
  },
  registerCallback: function(callback) {
    var room_name = getRoomName();
    this.chatRef.child(room_name).on('child_added', function(snapshot) {
      this.chatMessages.push(snapshot.val());
      callback(this.chatMessages);
    }.bind(this));
  }
};
