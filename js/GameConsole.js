var GameConsole = React.createClass({

  propTypes: {
    onSelectUsername: React.PropTypes.func.isRequired,
    onSelectRoom: React.PropTypes.func.isRequired
  },

  render: function() {
    return React.DOM.div({
      className: 'game-console'
    });
  }
});
