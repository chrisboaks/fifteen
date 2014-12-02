(function() {
  window.Fifteen = window.Fifteen || {};

  var Frame = Fifteen.Frame = function (tiles) {
    this.tiles = tiles || this.populateTiles();
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
    for (var row = 0; row < 4; row++) {
      for (var col = 0; col < 4; col++) {
        tiles[row].push(allTiles.shift());
      }
    }
    return tiles;
  };

  Frame.prototype.validCoords = function (coordinates) {
    var coords = coordinates.slice().sort();
    return (coords[0] >= 0 && coords[1] <= 3);
  };

  Frame.prototype.coordinatesOf = function (tile) {
    for (var row = 0; row < 4; row++) {
      for (var col = 0; col < 4; col++) {
        if (tile === this.tiles[row][col]) {
          return [row, col];
        }
      }
    }
  };

  Frame.prototype.coordinatesOfBlank = function () {
    for (var row = 0; row < 4; row++) {
      for (var col = 0; col < 4; col++) {
        if (this.tileAt([row, col]).val === 0) {
          return [row, col];
        }
      }
    }
  };

  Frame.prototype.neighborsOf = function (tile) {
    var tileCoords = this.coordinatesOf(tile);
    var row = tileCoords[0];
    var col = tileCoords[1];
    var coords = [[row+1, col], [row-1, col], [row, col+1], [row, col-1]];
    console.log(row, col, coords);
    coords = _.filter(coords, function (coordPair) {
      return this.validCoords(coordPair);
    }.bind(this));
    return _.map(coords, function (coordPair) {
      return this.tileAt(coordPair);
    }.bind(this));
  };

  Frame.prototype.tileAt = function (coordinates) {
    var row = coordinates[0];
    var col = coordinates[1];
    return this.tiles[row][col];
  };

  Frame.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, 800, 800);
    var flatTiles = _.flatten(this.tiles);
    _.each(flatTiles, function (tile) {
      tile.draw(ctx);
    });
  };

  Frame.prototype.dup = function () {                     //unnecessary?
    var dupTiles = [];
    _.each(this.tiles, function (row) {
      dupTiles.push(row.slice());
    });
    return new Frame(dupTiles);
  };

  Frame.prototype.setTile = function (tile, coordinates) {
    var row = coordinates[0];
    var col = coordinates[1];
    this.tiles[row][col] = tile;
  };

  Frame.prototype.slide = function (tile) {
    if (tile.neighborsBlank()) {
      var tileCoords = this.coordinatesOf(tile);
      var blankCoords = this.coordinatesOfBlank();
      this.setTile(tile, blankCoords);
      this.setTile(this.blank, tileCoords);
    }
  };

})();
