var Canvas = {
  init: function(canvas) {
    var me = this;
    me._canvas = canvas;
    me._context = canvas.getContext('2d');
    me._canvas.addEventListener('mousedown', function(event) {
      event.preventDefault(); // don't begin selection
      me._startStroke();
    });
    me._canvas.addEventListener('mouseup', function(event) {
      me._endStroke();
    });
    me._canvas.addEventListener('mousemove', function(event) {
    });
    __session.canvas.setCallback(function(points) {
    });
  },

  _startStroke: function() {
    this._drawing = true;
  },

  _endStroke: function() {
    if (!this._drawing) {
      return;
    }
  }
};

(function() {
  var canvas = document.getElementById('canvas');
  if (canvas) {
    Canvas.init(canvas);
  }
})();
