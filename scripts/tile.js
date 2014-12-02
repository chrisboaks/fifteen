(function() {
  window.Fifteen = window.Fifteen || {};

  var Tile = Fifteen.Tile = function (frame, val) {
    this.frame = frame;
    this.val = val;
  };

  Tile.prototype.slide = function () {
    // body...
  };

  Tile.prototype.isNeighbor = function (otherTile) {
    // body...
  };

  Tile.prototype.coordinates = function () {
    return this.frame.coordinatesOf(this);
  };

  Tile.prototype.row = function () {
    return this.coordinates()[0];
  };

  Tile.prototype.col = function () {
    return this.coordinates()[1];
  };

  Tile.prototype.draw = function (ctx) {
    if (this.val > 0) {
      var row = this.row();
      var col = this.col();
      console.log(ctx);
      ctx.fillStyle = 'red';
      ctx.font = "20px Arial";
      ctx.fillRect(col * 50, row * 50, 50, 50);
      ctx.fillStyle = 'white';
      ctx.fillText(this.val, col * 50 + 15, row * 50 + 25);
    }
  };

})();
