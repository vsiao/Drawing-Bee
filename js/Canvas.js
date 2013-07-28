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
      me._moveStroke();
    });
  },

  _startStroke: function() {
    this._drawing = true;
    //this._context.moveTo();
    //this._context.beginPath();
  },

  _endStroke: function() {
    if (!this._drawing) {
      return;
    }
    this._drawing = false;
  },

  _moveStroke: function() {
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
