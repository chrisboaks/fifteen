(function() {
  window.Fifteen = window.Fifteen || {};

  var Frame = Fifteen.Frame = function () {
    this.tiles = this.populateTiles();
    this.model = this.threeFrame();
    Fifteen.scene.add(this.model);
    this.isSliding = false;
    this.wasSolved = true;
    this.setTileCoordinates();
  };

  Frame.prototype.threeFrame = function () {
    var frameModel = new THREE.Object3D();

    var backingGeometry = new THREE.PlaneBufferGeometry(500, 500);
    var backingMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
    var backing = new THREE.Mesh(backingGeometry, backingMaterial);

    var frameMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
    var wallShape = this.wallShape();
    var frameWallGeometry = new THREE.ExtrudeGeometry(wallShape, {
      amount: 1,
      steps: 2,
      bevelEnabled: true,
      bevelThickness: 0.25,
      bevelSize: 0.15,
      bevelSegments: 3
    });

    frameModel.add(backing);
    frameModel.add(new THREE.Mesh(frameWallGeometry, frameMaterial));
    frameModel.position.z = -1;
    return frameModel;

  };

  Frame.prototype.wallShape = function (first_argument) {
    var far = 11.25;
    var near = 10.25;

    var wallShape = new THREE.Shape();
    wallShape.moveTo(-far, -far);
    wallShape.lineTo(far, -far);
    wallShape.lineTo(far, far);
    wallShape.lineTo(-far, far);
    wallShape.lineTo(-far, -far);

    var hole = new THREE.Path();
    hole.moveTo(-near, -near);
    hole.lineTo(near, -near);
    hole.lineTo(near, near);
    hole.lineTo(-near, near);
    hole.lineTo(-near, -near);

    wallShape.holes.push(hole);

    return wallShape;
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

  Frame.prototype.areValidCoords = function (coordinates) {
    var coords = coordinates.slice().sort();
    return (coords[0] >= 0 && coords[1] <= 3);
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

  Frame.prototype.swap = function (tile1, tile2) {
    var t1Coords = tile1.coordinates;
    var t2Coords = tile2.coordinates;
    this.setTile(tile1, t2Coords);
    this.setTile(tile2, t1Coords);
    tile1.setCoordinates(t2Coords);
    tile2.setCoordinates(t1Coords);
  };

  Frame.prototype.shuffle = function () {
    var flatTiles = _.flatten(this.tiles);
    var nonblanks = _.filter(flatTiles, function (tile) {
      return tile.val !== 0;
    });
    var swapPair;

    var blankCoords = this.blank().coordinates;
    var blankTaxiDist = 6 - blankCoords[0] - blankCoords[1];
    var swaps = (blankTaxiDist % 2 === 0 ? 50 : 49);

    for (var i = 0; i < swaps; i++) {
      swapPair = _.sample(nonblanks, 2);
      this.swap(swapPair[0], swapPair[1]);
    }

    this.setTileCoordinates();
    _.each(flatTiles, function (tile) {
      tile.setFramePosition();
    });

    this.displayUnsolved();
  };

  Frame.prototype.slideOne = function (tile, i) {
    if (tile.isNeighboringBlank()) {
      var blank = this.blank();
      var tileCoords = tile.coordinates;
      var blankCoords = blank.coordinates;

      this.swap(tile, blank);

      setTimeout(function () {
        tile.animate(tileCoords, blankCoords, 0);
      }, i * 125);
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

  Frame.prototype.tileRow = function (index) {
    return this.tiles[index];
  };

  Frame.prototype.tileCol = function (index) {
    var transposed = _.zip.apply(_, this.tiles);
    return transposed[index];
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
    }, (numToSlide + 1) * 125);
  };

  Frame.prototype.displaySolved = function () {
    if (this.isSolved()) {
      this.model.children[1].material.color.setHex(0xFFD700);
    }
  };

  Frame.prototype.displayUnsolved = function () {
    if (!this.isSolved()) {
      this.model.children[1].material.color.setHex(0xAAAAAA);
    }
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
