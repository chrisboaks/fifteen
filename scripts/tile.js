(function() {
  window.Fifteen = window.Fifteen || {};

  var Tile = Fifteen.Tile = function (frame, val) {
    this.frame = frame;
    this.val = val;
    this.model = this.threeTile(val);
    this.coordinates = null;
    if (val !== 0) {
      Fifteen.scene.add(this.model);
    }
  };

  Tile.GEOMETRY = new THREE.BoxGeometry( 4, 4, 1 );
  Tile.MATERIAL = new THREE.MeshPhongMaterial( { color: 0x101070 } );
  Tile.BASEGEOMETRY = new THREE.BoxGeometry( 4.75, 4.755, 0.2);
  Tile.BASEMATERIAL = new THREE.MeshPhongMaterial( { color: 0x003000 });
  Tile.TEXTOPTS = {
    size: 4,
    height: 1.5,
    font: 'helvetiker',
    // bevelEnabled: true,
    // bevelThickness: 0.2
  };

  // Tile.BASE = new THREE.BoxGeometry(5, 5, 1);

  Tile.prototype.threeTile = function (val) {
    var tile = new THREE.Mesh(Tile.GEOMETRY, Tile.MATERIAL);
    var base = new THREE.Mesh( Tile.BASEGEOMETRY, Tile.BASEMATERIAL );
    base.position.z = -0.4;
    base.castShadow = true;

    // var textGeo = new THREE.TextGeometry(val);
    // var text = new THREE.Mesh( textGeo, Tile.BASEMATERIAL );

    tile.add(base);
    // tile.add(text);


    tile.castShadow = true;
    tile.name = "Tile " + val;
    return tile;
  };

  Tile.prototype.isNeighboringBlank = function () {
    var neighbors = frame.neighborsOf(this);
    return _.any(neighbors, function (neighbor) {
      return neighbor.val === 0;
    });
  };

  Tile.prototype.setCoordinates = function (coords) {
    var oldCoords = this.coordinates;
    this.coordinates = coords;

    if (oldCoords && (oldCoords[1] !== coords[1] || oldCoords[0] !== coords[0])) {
      this.animate(oldCoords, coords, 0);
    } else {
      this.model.position.x = (coords[1] - 1.5) * 5;
      this.model.position.y = (coords[0] - 1.5) * -5;
    }
  };

  Tile.prototype.animate = function (oldCoords, newCoords, frame) {
    if (frame < 30 && this.val !== 0) {
      var that = this;
      var dX = frame * (newCoords[1] - oldCoords[1]) / 30;
      var dY = frame * (newCoords[0] - oldCoords[0]) / 30;
      this.model.position.x = (oldCoords[1] + dX - 1.5) * 5;
      this.model.position.y = (oldCoords[0] + dY - 1.5) * -5;
      setTimeout(function () {
        that.animate(oldCoords, newCoords, frame + 1);
      }, 1000 / 60);

    } else {

      this.model.position.x = (newCoords[1] - 1.5) * 5;
      this.model.position.y = (newCoords[0] - 1.5) * -5;
      this.frame.refreshTileCoordinates();
    }
  };

  Tile.prototype.wasClicked = function (tileModel) {
    return this.model === tileModel;
  };

})();
