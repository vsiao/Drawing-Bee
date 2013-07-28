var GameConsole = React.createClass({

  propTypes: {
    onSelectUsername: React.PropTypes.func.isRequired,
    username: React.PropTypes.string.isRequired,

    onSelectRoom: React.PropTypes.func.isRequired,
    room: React.PropTypes.string.isRequired,

    onStartGame: React.PropTypes.func.isRequired,
    waiting_to_start: React.PropTypes.bool,
    num_players: React.PropTypes.number,
    in_progress: React.PropTypes.bool
  },

  render: function() {
    var children = [
      this.props.in_progress
      ? (this.props.word ? GameConsole.PropertyTimerField({
          extra_classes: 'alert',
          header: this.props.is_drawing ? 'Hey you! Draw this'
            : 'Partner\'s drawing',
          editable: false,
          word: this.props.word
        }) : GameConsole.ButtonField({
          enabled: false,
          text: 'Guess away!'
        }))
      : (!this.props.waiting_to_start ? '' : GameConsole.ButtonField({
          onClick: this.props.onStartGame,
          enabled: this.props.num_players >= 3,
          text: this.props.num_players >= 3 ?
            'Start Game!' : 'Waiting for players'
        })),
      GameConsole.PropertyField({
        onChange: this.props.onSelectUsername,
        header: 'Hello, my name is',
        editable: true,
        value: this.props.username
      }),
      GameConsole.PropertyField({
        onChange: this.props.onSelectRoom,
        header: 'I\'m having fun in',
        editable: true,
        value: this.props.room
      })
    ];

    return React.DOM.div({
      className: 'game-console',
      children: children
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
    onChange: React.PropTypes.func,
    extra_classes: React.PropTypes.string,
    header: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    editable: React.PropTypes.bool
  },

  componentDidUpdate: function(prevProps, prevState, rootNode) {
    if (this.state.editing) {
      this.refs['input'].getDOMNode().focus();
    }
  },

  render: function() {
    var me = this;
    var input = '';
    var edit_button = '';
    if (this.props.editable) {
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
    }

    return React.DOM.div({
      className: 'property ' +
          (this.props.extra_classes || ''),
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

GameConsole.PropertyTimerField = React.createClass({
  getInitialState: function() {
    return {
      time_remaining: 800,
      timer: null
    };
  },

  componentWillUnmount: function() {
    this.state.timer && clearTimeout(this.state.timer);
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({time_remaining: 800});
  },

  render: function() {
    var me = this;
    if (this.state.timer) {
      clearTimeout(this.state.timer);
    }
    this.state.timer = setTimeout(function() {
      time_remaining = me.state.time_remaining - 3;
      me.setState({time_remaining: time_remaining});
    }, 30);
    this.props.value = this.props.word + ' ('
      + (Math.max(0, Math.floor(this.state.time_remaining / 100))) + '.'
      + (Math.max(0, this.state.time_remaining % 100)) + 's)'
    return GameConsole.PropertyField(this.props);
  }
});

GameConsole.ButtonField = React.createClass({

  propTypes: {
    enabled: React.PropTypes.bool.isRequired,
    onClick: React.PropTypes.func,
    text: React.PropTypes.string
  },

  render: function() {
    return React.DOM.div({
      className: 'button-field'
    }, React.DOM.a({
      className: 'button-field-button' +
        (this.props.enabled ? '' : ' disabled'),
      href: '#',
      onClick: this.props.enabled ? this.props.onClick : null
    }, this.props.text));
  }
});
