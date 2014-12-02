(function() {
  window.Fifteen = window.Fifteen || {};

  var Frame = Fifteen.Frame = function () {
    this.tiles = this.populateTiles();
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

  Frame.prototype.areValidCoords = function (coordinates) {
    var coords = coordinates.slice().sort();
    return (coords[0] >= 0 && coords[1] <= 3);
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
    var row = tile.coordinates[0];
    var col = tile.coordinates[1];
    var coords = [[row+1, col], [row-1, col], [row, col+1], [row, col-1]];
    coords = _.filter(coords, function (coordPair) {
      return this.areValidCoords(coordPair);
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

  Frame.prototype.setTile = function (tile, coordinates) {
    var row = coordinates[0];
    var col = coordinates[1];
    this.tiles[row][col] = tile;
  };

  Frame.prototype.slide = function (tile) {
    if (tile.isNeighboringBlank()) {
      var tileCoords = tile.coordinates;
      var blankCoords = this.coordinatesOfBlank();
      var blank = this.tileAt(blankCoords);
      this.setTile(tile, blankCoords);
      this.setTile(blank, tileCoords);
    }
    this.refreshTileCoordinates();
  };

  Frame.prototype.handleClick = function (mouseCoords) {
    var flatTiles = _.flatten(this.tiles);
    for (var i = 0; i < 16; i++) {
      if (flatTiles[i].wasClicked(mouseCoords)) {
        this.slide(flatTiles[i]);
        return;
      }
    }
  };

  Frame.prototype.refreshTileCoordinates = function () {
    for (var row = 0; row < 4; row++) {
      for (var col = 0; col < 4; col++) {
        this.tiles[row][col].setCoordinates([row, col]);
      }
    }
  };

  Frame.prototype.isSolved = function () {
    var flatTiles = _.flatten(this.tiles);
    for (var i = 0; i < 15; i++) {
      if (flatTiles[i].val !== i + 1) {
        return false;
      }
    }
    return true;
  };

})();
