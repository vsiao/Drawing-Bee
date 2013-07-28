var Canvas = {
  clear: function() {
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
  },

  init: function(canvas) {
    var me = this;
    me._canvas = canvas;
    me._context = canvas.getContext('2d');
    me._canvas.addEventListener('mousedown', function(event) {
      event.preventDefault(); // don't begin selection
      canvas_rect = me._canvas.getBoundingClientRect();
      me._stroke_ref = __session.canvas.startStroke({
        x: event.pageX - canvas_rect.left - 10,
        y: event.pageY - canvas_rect.top - 10,
        style: '#ff0000'
      });
    });
    me._canvas.addEventListener('mouseup', function(event) {
      me.endStroke();
    });
    me._canvas.addEventListener('mousemove', function(event) {
      if (!me._drawing || !me._stroke_ref) {
        return;
      }
      canvas_rect = me._canvas.getBoundingClientRect();
      __session.canvas.addToStroke({
        x: event.pageX - canvas_rect.left - 10,
        y: event.pageY - canvas_rect.top - 10
      }, me._stroke_ref);
    });
    this._context.lineWidth = 5;
    this._context.strokeStyle = "black";
  },

  startStroke: function(coord) {
    if (this._drawing) {
      this.endStroke();
    }
    this._drawing = true;
    this._context.strokeStyle = coord.style;
    this._context.moveTo(coord.x, coord.y);
    this._context.beginPath();
  },

  endStroke: function() {
    if (!this._drawing) {
      return;
    }
    this._drawing = false;
    this._context.closePath();
  },

  moveStroke: function(coord) {
    if (!this._drawing) {
      return;
    }
    this._context.lineTo(coord.x, coord.y);
    this._context.stroke();
  }
};

(function() {
  var canvas = document.getElementById('canvas');
  if (canvas) {
    Canvas.init(canvas);
  }
})();
