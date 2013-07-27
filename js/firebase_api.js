function getRoomName() {
  return 'a_room_name';
}
function getUserName() {
  return 'donald'
}
FB = {
  chatRef: new Firebase('https://drawingbee.firebaseio.com/chats'),
  drawingRef: new Firebase('https://drawingbee.firebaseio.com/drawings'),
  writeChat: function(text) {
    var room_name = getRoomName(),
        user_name = getUserName(),
        room_ref = this.chatRef.child(room_name);
    room_ref.push({user_name: user_name, message: text});
  }
};
