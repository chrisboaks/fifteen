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

  var sqLength = 4;

  Tile.BASE = new THREE.Shape();
  Tile.BASE.moveTo(-sqLength/2, -sqLength/2);
  Tile.BASE.lineTo(-sqLength/2, sqLength/2);
  Tile.BASE.lineTo(sqLength/2, sqLength/2);
  Tile.BASE.lineTo(sqLength/2, -sqLength/2);
  Tile.BASE.lineTo(-sqLength/2, -sqLength/2);

  Tile.GEOMETRY = new THREE.ExtrudeGeometry(Tile.BASE, {
    amount: 1,
    steps: 2,
    bevelEnabled: true,
    bevelThickness: 0.25,
    bevelSize: 0.15,
    bevelSegments: 3
  });

  Tile.MATERIAL = new THREE.MeshPhongMaterial({ color: 0x101070 });
  Tile.BASEGEOMETRY = new THREE.BoxGeometry(4.75, 4.755, 0.2);
  Tile.BASEMATERIAL = new THREE.MeshPhongMaterial( { color: 0x003000 });
  Tile.TEXTMATERIAL = new THREE.MeshLambertMaterial({ color: 0xdddddd });


  Tile.prototype.threeTile = function (val) {
    var tile = new THREE.Object3D()

    var stand = new THREE.Mesh(Tile.GEOMETRY, Tile.MATERIAL);
    stand.position.z = -1;

    var base = new THREE.Mesh( Tile.BASEGEOMETRY, Tile.BASEMATERIAL );
    base.position.z = -0.4;

    var textGeom = new THREE.TextGeometry( val, {
      font: 'helvetiker',
      size: 2,
      height: 1,
      bevelEnabled: true,
      bevelThickness: 0.25,
      bevelSize: 0.15
    });
    var textMesh = new THREE.Mesh( textGeom, Tile.TEXTMATERIAL );
    var textOffset = val > 9 ? -1.75 : -0.75;

    textMesh.position.set(textOffset, -1, -0.5);
    tile.add(stand);
    tile.add(textMesh);
    tile.add(base);
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
    this.coordinates = coords;
  };

  Tile.prototype.setFramePosition = function (coordinates) {
    var coords = coordinates || this.coordinates;
    this.model.position.x = (coords[1] - 1.5) * 5;
    this.model.position.y = (coords[0] - 1.5) * -5;
  };

  Tile.prototype.animate = function (oldCoords, newCoords, frame) {
    var frames = 15;
    if (frame < frames && this.val !== 0) {
      var that = this;
      var dX = frame * (newCoords[1] - oldCoords[1]) / frames;
      var dY = frame * (newCoords[0] - oldCoords[0]) / frames;

      this.model.position.x = (oldCoords[1] + dX - 1.5) * 5;
      this.model.position.y = (oldCoords[0] + dY - 1.5) * -5;

      setTimeout(function () {
        that.animate(oldCoords, newCoords, frame + 1);
      }, 1000 / 60);

    } else {
      // ensures tiles are correctly placed after animation
      this.setFramePosition();
    }
  };

  Tile.prototype.wasClicked = function (tileModels) {
    for (var i = 0; i < tileModels.length; i++) {
      if (this.model === tileModels[i]) {
        return true;
      }
    }
    return false;
  };

})();
