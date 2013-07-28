var ChatInput = React.createClass({

  propTypes: {
    onSubmit: React.PropTypes.func.isRequired
  },

  onKeyDown: function(event) {
    if (event.keyCode === /*ENTER*/13) {
      var message = this.refs['chat_input'].getDOMNode().value;
      this.refs['chat_input'].getDOMNode().value = '';
      this.props.onSubmit(message);
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
    author: React.PropTypes.string.isRequired,
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

var ChatSidebar = React.createClass({

  propTypes: {
    onSubmitMessage: React.PropTypes.func.isRequired,
    messages: React.PropTypes.array.isRequired
  },

  componentDidUpdate: function(prevProps, prevState, rootNode) {
    var messages_container = this.refs['chat_messages'].getDOMNode();
    messages_container.scrollTop = messages_container.scrollHeight;
  },

  startGame: function() {
    // start the friggin game
  },

  render: function() {
    return React.DOM.div({
      className: 'chat-container',
      children: [
        React.DOM.div({
          className: 'start-game',
          children: [
            React.DOM.a({
              className: 'start-game-button',
              onClick: this.startGame,
              href: '#'
            }, 'Start Game!')
          ]
        }),
        React.DOM.ul({
          className: 'chat-messages',
          ref: 'chat_messages',
          children: this.props.messages.map(function(message) {
            return ChatMessage({
              author: message.author,
              body: message.body
            });
          })
        }),
        React.DOM.div({className: 'chat-input-container'},
          ChatInput({onSubmit: this.props.onSubmitMessage}))
      ]
    });
  }
});
