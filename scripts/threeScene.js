(function () {
  window.Fifteen = window.Fifteen || {};

  var scene = Fifteen.scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 55, 1, 0.1, 1000 );

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(800, 800);
  $('#container').append(renderer.domElement);

  var directionalLight = new THREE.PointLight( 0x888888, 0.9 );
  directionalLight.position.set( -8, 8, 8 );
  scene.add( directionalLight );
  var light = new THREE.AmbientLight( 0x444444 );
  scene.add( light );

  camera.position.z = 20;


  var render = Fifteen.render = function () {
    window.frame.refreshTileCoordinates();
    requestAnimationFrame( render );

    renderer.render(scene, camera);
  };


})();
