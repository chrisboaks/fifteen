(function () {
  window.Fifteen = window.Fifteen || {};

  var scene = Fifteen.scene = new THREE.Scene();

  var $gamespace = $('#gamespace');

  // var refGeo = new THREE.BoxGeometry( 1, 1, 1);
  // var refMat = new THREE.MeshPhongMaterial( {color: 0x000000 });
  // var reference = new THREE.Mesh(refGeo, refMat);
  // reference.name = "reference";
  // scene.add(reference);

  $gamespace.click( onClick );

  var camera = new THREE.PerspectiveCamera( 55, 1, 0.1, 1000 );
  camera.position.z = 20;

  var cameraControl = new THREE.OrbitControls(camera);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(800, 800);
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;
  $gamespace.append(renderer.domElement);

  var spotLight = new THREE.SpotLight( 0xffffff, 0.75 );
  spotLight.position.set( -8, 8, 40 );
  spotLight.castShadow = true;
  spotLight.shadowDarkness = 0.7;
  spotLight.shadowCameraNear = 5;
  // spotLight.shadowCameraVisible = true;
  scene.add( spotLight );

  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.position.set( -8, 8, 40 );
  scene.add( directionalLight );

  function onClick( event ) {
    if (window.frame.isSliding) {
      return;
    }

    var x = event.pageX - $gamespace.offset().left;
    var y = event.pageY - $gamespace.offset().top;

    var mouseX = 2 * (x / 800) - 1;
    var mouseY = 1 - 2 * ( y / 800 );

    var vector = new THREE.Vector3( mouseX, mouseY, camera.near );
    vector.unproject( camera );

    var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    var intersects = raycaster.intersectObjects( Fifteen.scene.children );

    if (intersects.length > 0) {
      console.log(_.map(intersects, function (obj) {
        return obj.object.name;
      }));
      window.frame.handleClick( intersects[0].object );
    }
  }

  var lightTheta = 0;
  var moveLight = Fifteen.movelight = function (theta) {
    spotLight.position.x = 0.5 * Math.cos(theta) - 8;
    spotLight.position.y = 0.5 * Math.sin(theta) + 8;
  };


  var render = Fifteen.render = function () {
    lightTheta += 0.05;
    Fifteen.movelight(lightTheta);
    // cameraControl.update();
    // window.frame.refreshTileCoordinates();
    requestAnimationFrame( render );

    renderer.render(scene, camera);
  };


})();
