(function() {
  window.Fifteen = window.Fifteen || {};

  var Frame = Fifteen.Frame = function () {
    this.tiles = this.populateTiles();
    this.model = this.threeFrame();
    this.isSliding = false;
    this.wasSolved = true;
    Fifteen.scene.add(this.model);
    this.setTileCoordinates();
  };

  Frame.prototype.threeFrame = function () {
    var frame = new THREE.Object3D();

    var backingGeometry = new THREE.PlaneBufferGeometry(10000, 10000);
    var backingMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
    var backing = new THREE.Mesh(backingGeometry, backingMaterial);

    var frameMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    var sideGeometry = new THREE.BoxGeometry(1, 22, 2);
    var vertGeometry = new THREE.BoxGeometry(22, 1, 2);

    var left = new THREE.Mesh(sideGeometry, frameMaterial);
    left.position.x = -10.5;
    var right = new THREE.Mesh(sideGeometry, frameMaterial);
    right.position.x = 10.5;
    var top = new THREE.Mesh(vertGeometry, frameMaterial);
    top.position.y = 10.5;
    var bottom = new THREE.Mesh(vertGeometry, frameMaterial);
    bottom.position.y = -10.5;

    frame.add(backing);
    frame.add(left);
    frame.add(right);
    frame.add(top);
    frame.add(bottom);

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
        var tile = allTiles.shift();
        tile.setFramePosition([row, col]);
        tiles[row].push(tile);
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

  Frame.prototype.slideOne = function (tile, i) {
    if (tile.isNeighboringBlank()) {
      var tileCoords = tile.coordinates;
      var blank = this.blank();
      var blankCoords = blank.coordinates;
      this.setTile(tile, blankCoords);
      this.setTile(blank, tileCoords);
      tile.setCoordinates(blankCoords);
      blank.setCoordinates(tileCoords);
      setTimeout(function () {
        tile.animate(tileCoords, blankCoords, 0);
      }, i*250);
    }
  };

  Frame.prototype.slide = function (tile) {
    var blankCoords = this.blank().coordinates;
    var row = tile.coordinates[0];
    var col = tile.coordinates[1];
    if (row === blankCoords[0]) {
      this.slideMany(tile, this.tileRow(row));
    } else if (col === blankCoords[1]) {
      this.slideMany(tile, this.tileCol(col));
    }

  };

  Frame.prototype.slideMany = function (keyTile, tileSet) {
    var blank = this.blank(),
        blankIndex = tileSet.indexOf(blank),
        keyIndex = tileSet.indexOf(keyTile),
        numToSlide = Math.abs(keyIndex - blankIndex),
        frame = this,
        subset;

    if (blankIndex < keyIndex) {
      subset = tileSet.slice(blankIndex + 1, keyIndex + 1);
    } else {
      subset = tileSet.slice(keyIndex, blankIndex).reverse();
    }

    frame.isSliding = true;
    for (var i = 0; i < numToSlide; i++) {
      this.slideOne(subset[i], i);
    }
    frame.displayUnsolved();
    setTimeout(function () {
      frame.isSliding = false;
      frame.displaySolved();
    }, (numToSlide + 1) * 250);
  };

  Frame.prototype.displaySolved = function () {
    if (this.isSolved() && !this.wasSolved) {
      this.model.children[1].material.color.setHex(0xffff00);
      this.wasSolved = true;
    }
  };

  Frame.prototype.displayUnsolved = function () {
    if (!this.isSolved() && this.wasSolved){
      this.model.children[1].material.color.setHex(0xaaaaaa);
      this.wasSolved = false;
    }
  };

  Frame.prototype.tileRow = function (index) {
    return this.tiles[index];
  };

  Frame.prototype.tileCol = function (index) {
    var transposed = _.zip.apply(_, this.tiles);
    return transposed[index];
  };

  Frame.prototype.handleClick = function (intersectObjs) {
    if (!this.isSliding) {
      var flatTiles = _.flatten(this.tiles);
      for (var i = 0; i < 16; i++) {
        if (flatTiles[i].wasClicked(intersectObjs)) {
          this.slide(flatTiles[i]);
          return;
        }
      }
    }
  };

  Frame.prototype.setTileCoordinates = function () {
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
