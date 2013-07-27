/** @jsx React.DOM */

var ChatInput = React.createClass({

  propTypes: {
  },

  render: function() {
  }
});

var ChatMessage = React.createClass({

  propTypes: {
    author: React.PropTypes.string.isRequired, // maybe make this a user class?
    body: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <li className="chat-message">
        <span className="chat-author">{this.props.author}</span>
        {this.props.body}
      </li>
    );
  }
});

var Chat = React.createClass({

  propTypes: {
    messages: React.PropTypes.array.isRequired
  },

  render: function() {
    return (
      <div className="chat-container">
        <ul
          className="chat-messages"
          children={this.props.messages.map(function(message) {
            return <ChatMessage author={message.author} body={message.body} />;
          })}
        />
        <input className="chat-input" />
      </div>
    );
  }
});

React.renderComponent(
  <Chat messages={[{
    author: 'Vincent Siao',
    body: 'Hello World!'
  }]} />,
  document.getElementById('react_chat')
);
