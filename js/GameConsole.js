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
        GameConsole.PropertyField({
          onChange: this.props.onSelectUsername,
          header: 'Hello, my name is',
          value: this.props.username
        }),
        GameConsole.PropertyField({
          onChange: this.props.onSelectRoom,
          header: 'I\'m having fun in',
          value: this.props.room
        })
      ]
    });
  }
});

GameConsole.PropertyField = React.createClass({

  getInitialState: function() {
    return {
      editing: false,
      input_value: '',
    };
  },

  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    header: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired
  },

  componentDidUpdate: function(prevProps, prevState, rootNode) {
    if (this.state.editing) {
      this.refs['input'].getDOMNode().focus();
    }
  },

  render: function() {
    var me = this;
    var input = React.DOM.input({
      className: 'property-input',
      ref: 'input',
      value: this.state.input_value,
      onKeyDown: function(event) {
        if (event.keyCode === /*ENTER*/13) {
          me.props.onChange(
            me.refs['input'].getDOMNode().value);
          me.setState({editing: false});
        }
      },
      onChange: function() {
        me.setState({
          input_value: me.refs['input'].getDOMNode().value
        });
      }
    });
    var edit_button = React.DOM.a({
      className: 'property-edit',
      href: '#',
      onClick: function() {
        me.setState({
          editing: true,
          input_value: me.props.value
        });
      }
    }, 'Edit');

    return React.DOM.div({
      className: 'property',
      children: [
        React.DOM.div({
          className: 'property-header'
        }, this.props.header),
        this.state.editing ? input : this.props.value,
        this.state.editing ? '' : edit_button
      ]
    });
  }
});
