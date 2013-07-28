var ChatInput = React.createClass({

  propTypes: {
    author: React.PropTypes.string.isRequired
  },

  onKeyDown: function(event) {
    if (event.keyCode === /*ENTER*/13) {
      var message = this.refs['chat_input'].getDOMNode().value;
      this.refs['chat_input'].getDOMNode().value = '';
      __session.chat.write(message);
    }
  },

  render: function() {
    return React.DOM.input({
      className: 'chat-input',
      ref: 'chat_input',
      placeholder: 'Chat...',
      onKeyDown: this.onKeyDown
    });
  }
});

var ChatMessage = React.createClass({

  propTypes: {
    author: React.PropTypes.string.isRequired, // maybe make this a user class?
    body: React.PropTypes.string.isRequired
  },

  render: function() {
    return React.DOM.li({
      className: 'chat-message',
      children: [
        React.DOM.span({
          className: 'chat-author',
          children: [this.props.author]
        }),
        this.props.body
      ]
    });
  }
});

var Chat = React.createClass({

  propTypes: {
    author: React.PropTypes.string.isRequired,
    messages: React.PropTypes.array.isRequired
  },

  componentDidUpdate: function(prevProps, prevState, rootNode) {
    rootNode.scrollTop = rootNode.scrollHeight;
  },

  render: function() {
    return React.DOM.div({
      className: 'chat-container',
      children: [
        React.DOM.ul({
          className: 'chat-messages',
          children: this.props.messages.map(function(message) {
            return ChatMessage({
              author: message.author,
              body: message.body
            });
          })
        }),
        React.DOM.div({
          className: 'chat-input-container',
          children: [
            ChatInput({author: this.props.author})
          ]
        })
      ]
    });
  }
});

function updateChat(chat_messages) {
  React.renderComponent(
    Chat({author: 'Vincent Siao', messages: chat_messages}),
    document.getElementById('react_chat')
  );
}

__session.chat.setCallback(updateChat);
