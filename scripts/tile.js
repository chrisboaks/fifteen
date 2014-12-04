(function() {
  window.Fifteen = window.Fifteen || {};

  var Tile = Fifteen.Tile = function (frame, val) {
    this.frame = frame;
    this.val = val;
    this.model = new THREE.Mesh(Tile.GEOMETRY, Tile.MATERIAL);
    this.coordinates = null;
    if (val !== 0) {
      Fifteen.scene.add(this.model);
    }

    // console.log('hi', Fifteen.scene);
  };

  Tile.GEOMETRY = new THREE.BoxGeometry( 4, 4, 1 );
  Tile.MATERIAL = new THREE.MeshPhongMaterial( { color: 0x909090 } );

  Tile.prototype.isNeighboringBlank = function () {
    var neighbors = frame.neighborsOf(this);
    return _.any(neighbors, function (neighbor) {
      return neighbor.val === 0;
    });
  };

  Tile.prototype.setCoordinates = function (coords) {
    this.coordinates = coords;
    var x = coords[0];
    var y = coords[1];
    this.model.position.x = x * 5;
    this.model.position.y = -y * 5;
  };



  // Tile.prototype.draw = function (ctx) {
  //   if (this.val > 0) {
  //     var row = this.coordinates[0];
  //     var col = this.coordinates[1];
  //     ctx.fillStyle = 'red';
  //     ctx.strokeStyle = 'black';
  //     ctx.font = "20px Arial";
  //     ctx.fillRect(col * 200, row * 200, 200, 200);
  //     ctx.strokeRect(col * 200, row * 200, 200, 200);
  //     ctx.fillStyle = 'white';
  //     ctx.fillText(this.val, col * 200 + 15, row * 200 + 25);
  //   }
  // };

  Tile.prototype.wasClicked = function (mouseCoords) {
    var x = mouseCoords[0];
    var y = mouseCoords[1];
    var col = this.coordinates[1];
    var row = this.coordinates[0];
    return col * 200 <= x && x <= col * 200 + 200 &&
           row * 200 <= y && y <= row * 200 + 200;
  };

})();
