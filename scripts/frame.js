(function() {
  window.Fifteen = window.Fifteen || {};

  var Frame = Fifteen.Frame = function () {
    this.tiles = this.populateTiles();
    this.blank = this.tiles[3][3];
  };


  Frame.prototype.populateTiles = function () {
    var allTiles = [];
    var tiles = [ [], [], [], [] ];
    for (var i = 0; i < 16; i++) {
      var t = new Fifteen.Tile(this, i);
      allTiles.push(t);
    }
    allTiles.push(allTiles.shift());
    for (var row = 0; row < 4; row ++) {
      for (var col = 0; col < 4; col++) {
        tiles[row].push(allTiles.shift());
      }
    }
    return tiles;
  };

  Frame.prototype.coordinatesOf = function (tile) {
    for (var row = 0; row < 4; row ++) {
      for (var col = 0; col < 4; col++) {
        if (tile === this.tiles[row][col]) {
          return [row, col];
        }
      }
    }
  };

  Frame.prototype.tileAt = function (coordinates) {
    var row = coordinates[0];
    var col = coordinates[1];
    return this.tiles[row][col];
  };

  Frame.prototype.draw = function (ctx) {
    var flatTiles = _.flatten(this.tiles);
    _.each(flatTiles, function (tile) {
      tile.draw(ctx);
    });
  };


})();
