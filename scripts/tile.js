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

  Tile.prototype.draw = function () {
    if (this.val > 0) {

      //code
    }
  };

})();
