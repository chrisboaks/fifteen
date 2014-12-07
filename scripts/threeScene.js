(function () {
  window.Fifteen = window.Fifteen || {};

  var scene = Fifteen.scene = new THREE.Scene();

  var $gamespace = $('#gamespace');

  $gamespace.click( onClick );

  var camera = new THREE.PerspectiveCamera( 55, 1, 0.1, 1000 );
  camera.position.z = 20;

  // var cameraControl = new THREE.OrbitControls(camera);

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

  function onClick( e ) {

    var mouseX = 2 * (e.clientX / 800) - 1;
    var mouseY = 1 - 2 * ( e.clientY / 800 );

    var vector = new THREE.Vector3( mouseX, mouseY, camera.near );
    vector.unproject( camera );

    var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    var intersects = raycaster.intersectObjects( Fifteen.scene.children );

    if (intersects.length > 0) {
      window.frame.handleClick( intersects[0].object );
    }

  }




  // var lightTheta = 0;
  // var moveLight = Fifteen.movelight = function (theta) {
  //   directionalLight.position.x = 3 * Math.cos(theta) - 8;
  //   directionalLight.position.y = 3 * Math.sin(theta) + 8;
  // };


  var render = Fifteen.render = function () {
    // lightTheta += 0.05;
    // Fifteen.movelight(lightTheta);
    // cameraControl.update();
    window.frame.refreshTileCoordinates();
    requestAnimationFrame( render );

    renderer.render(scene, camera);
  };


})();
