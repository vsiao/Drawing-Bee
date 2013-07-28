var Canvas = {

  colors: [
    '#ea1999', // hot pink
    '#328eec', // blue
    '#37aa93', // turquoise
    '#32ec32', // poison green
    '#ece532'  // sunshine yello
  ],

  clear: function() {
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
  },

  disable: function() {
    this._can_draw = false;
  },
  enable: function() {
    this._can_draw = true;
  },
  _can_draw: true,

  init: function(root, canvas) {
    var me = this;
    me._makeColors(root);
    me._color = me.colors[0];
    me._canvas = canvas;
    me._context = canvas.getContext('2d');
    me._canvas.addEventListener('mousedown', function(event) {
      event.preventDefault(); // don't begin selection
      if (!me._can_draw) {
        return;
      }
      canvas_rect = me._canvas.getBoundingClientRect();
      me._stroke_ref = __session.canvas.startStroke({
        x: event.pageX - canvas_rect.left - 10,
        y: event.pageY - canvas_rect.top - 10,
        style: me._color,
        author: __session.user_name
      });
    });
    me._canvas.addEventListener('mouseup', function(event) {
      me.endStroke();
    });
    me._canvas.addEventListener('mousemove', function(event) {
      if (!me._can_draw || !me._drawing || !me._stroke_ref) {
        return;
      }
      canvas_rect = me._canvas.getBoundingClientRect();
      __session.canvas.addToStroke({
        x: event.pageX - canvas_rect.left - 10,
        y: event.pageY - canvas_rect.top - 10,
        color: me._color
      }, me._stroke_ref);
    });
    this._context.lineWidth = 5;
    this._context.strokeStyle = "black";
  },

  _makeColors: function(root) {
    var me = this;
    var palette = document.createElement('div');
    palette.id = 'color_palette';
    this.colors.forEach(function(color) {
      var node = document.createElement('a');
      node.style.background = color;
      node.className = 'color-choice';
      node.onclick = function() {
        me._color = color;
        var color_elems = palette.children;
        for (var i=0; i < color_elems.length; i++) {
          if (color_elems[i] == this) {
            color_elems[i].className = 'color-choice selected';
          } else {
            color_elems[i].className = 'color-choice';
          }
        }
      };
      palette.appendChild(node);
    });
    palette.firstChild.className += ' selected'
    root.appendChild(palette);
  },

  startStroke: function(coord) {
    if (this._drawing) {
      this.endStroke();
    }
    this._drawing = coord.author;
    this._context.strokeStyle = coord.style;
    this._context.moveTo(coord.x, coord.y);
    this._context.beginPath();
  },

  endStroke: function() {
    if (!this._drawing) {
      return;
    }
    if (__session.user_name == this._drawing) {
      __session.game.finish_stroke();
    }
    this._drawing = null;
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
  var root = document.getElementById('canvas_container');
  var canvas = document.getElementById('canvas');
  if (root && canvas) {
    Canvas.init(root, canvas);
  }
})();
