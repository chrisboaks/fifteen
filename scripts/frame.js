(function() {
  window.Fifteen = window.Fifteen || {};

  var Frame = Fifteen.Frame = function () {
    this.tiles = this.populateTiles();
    this.model = this.threeFrame();
    this.isSliding = false;
    Fifteen.scene.add(this.model);
    this.refreshTileCoordinates();
  };

  Frame.prototype.threeFrame = function () {
    var frameGeometry = new THREE.PlaneBufferGeometry(100, 100);
    var frameMaterial = new THREE.MeshPhongMaterial({ color: 0x696969 });
    var frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.receiveShadow = true;
    frame.position.z = -0.5;
    return frame;

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

  Frame.prototype.blank = function () {
    var tile;
    for (var row = 0; row < 4; row++) {
      for (var col = 0; col < 4; col++) {
        tile = this.tileAt([row, col]);
        if (tile.val === 0) {
          return tile;
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

  Frame.prototype.setTile = function (tile, coordinates) {
    var row = coordinates[0];
    var col = coordinates[1];
    this.tiles[row][col] = tile;
  };

  Frame.prototype.slideOne = function (tile) {
    if (tile.isNeighboringBlank()) {
      var tileCoords = tile.coordinates;
      var blank = this.blank();
      var blankCoords = blank.coordinates;
      this.setTile(tile, blankCoords);
      this.setTile(blank, tileCoords);
      tile.setCoordinates(blankCoords);
    }
  };

  Frame.prototype.slide = function (tile) {
    this.isSliding = true;
    var blankCoords = this.blank().coordinates;
    var row = tile.coordinates[0];
    var col = tile.coordinates[1];
    if (row === blankCoords[0]) {
      this.slideMany(tile, this.tileRow(row));
    } else if (col === blankCoords[1]) {
      this.slideMany(tile, this.tileCol(col));
    }
    this.isSliding = false;
  };

  Frame.prototype.slideMany = function (keyTile, tileSet) {
    var blank = this.blank();
    var blankIndex = tileSet.indexOf(blank);
    var keyIndex = tileSet.indexOf(keyTile);
    var numToSlide = Math.abs(keyIndex - blankIndex);
    var subset;
    if (blankIndex < keyIndex) {
      subset = tileSet.slice(blankIndex + 1, keyIndex + 1);
    } else {
      subset = tileSet.slice(keyIndex, blankIndex).reverse();
    }

    for (var i = 0; i < numToSlide; i++) {
      this.slideOneLater(subset[i], i);
    }
  };

  Frame.prototype.slideOneLater = function (tile, i) {
    var that = this;
    setTimeout(function () {
      // console.log(subset, i, subset[i]);
      that.slideOne(tile);
    }, i*510);
  };

  Frame.prototype.tileRow = function (index) {
    return this.tiles[index];
  };

  Frame.prototype.tileCol = function (index) {
    var transposed = _.zip.apply(_, this.tiles);
    return transposed[index];
  };

  Frame.prototype.handleClick = function (intersectObj) {
    var flatTiles = _.flatten(this.tiles);
    for (var i = 0; i < 16; i++) {
      if (flatTiles[i].wasClicked(intersectObj)) {
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
