(function() {
  window.Fifteen = window.Fifteen || {};

  var Tile = Fifteen.Tile = function (frame, val) {
    this.frame = frame;
    this.val = val;
  };

  Tile.prototype.slide = function () {              ////unnecessary?
    if (this.neighborsBlank()) {
      this.frame.slide(this);
    }
  };

  Tile.prototype.neighborsBlank = function (otherTile) {
    var blankCoords = this.frame.coordinatesOfBlank();
    var theseCoords = this.coordinates();
    var dRow = Math.abs(blankCoords[0] - theseCoords[0]);
    var dCol = Math.abs(blankCoords[1] - theseCoords[1]);
    var distances = [dRow, dCol].sort();
    if (distances[0] === 0 && distances[1] === 1) {
      return true;
    } else {
      return false;
    }
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
      ctx.fillStyle = 'red';
      ctx.strokeStyle = 'black';
      ctx.font = "20px Arial";
      ctx.fillRect(col * 200, row * 200, 200, 200);
      ctx.strokeRect(col * 200, row * 200, 200, 200);
      ctx.fillStyle = 'white';
      ctx.fillText(this.val, col * 200 + 15, row * 200 + 25);
    }
  };

})();
