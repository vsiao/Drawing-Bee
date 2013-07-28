var GameConsole = React.createClass({

  propTypes: {
    onSelectUsername: React.PropTypes.func.isRequired,
    onSelectRoom: React.PropTypes.func.isRequired,
    username: React.PropTypes.string.isRequired,
    room: React.PropTypes.string.isRequired
  },

  render: function() {
    return React.DOM.div({
      className: 'game-console',
      children: [
        GameConsole.Username({
          onSelectUsername: this.props.onSelectUsername,
          username: this.props.username
        }),
        GameConsole.Room({
        })
      ]
    });
  }
});

GameConsole.Username = React.createClass({

  getInitialState: function() {
    return {
      editing: false,
      input_value: '',
    };
  },

  propTypes: {
    onSelectUsername: React.PropTypes.func.isRequired,
    username: React.PropTypes.string.isRequired
  },

  componentDidUpdate: function(prevProps, prevState, rootNode) {
    if (this.state.editing) {
      this.refs['username_input'].getDOMNode().focus();
    }
  },

  render: function() {
    var me = this;
    var name_input = React.DOM.input({
      className: 'username-input',
      ref: 'username_input',
      value: this.state.input_value,
      onKeyDown: function(event) {
        if (event.keyCode === /*ENTER*/13) {
          me.props.onSelectUsername(
            me.refs['username_input'].getDOMNode().value);
          me.setState({editing: false});
        }
      },
      onChange: function() {
        me.setState({
          input_value: me.refs['username_input'].getDOMNode().value
        });
      }
    });
    var edit_button = React.DOM.a({
      className: 'username-edit',
      href: '#',
      onClick: function() {
        me.setState({
          editing: true,
          input_value: me.props.username
        });
      }
    }, 'Edit');

    return React.DOM.div({
      className: 'user-info',
      children: [
        React.DOM.div({
          className: 'username-header'
        }, 'Hello, my name is'),
        this.state.editing ? name_input : this.props.username,
        this.state.editing ? '' : edit_button
      ]
    });
  }
});

GameConsole.Room = React.createClass({
  render: function() {
    return React.DOM.div({
      className: 'room-info'
    });
  }
});
