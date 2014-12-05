(function () {
  window.Fifteen = window.Fifteen || {};

  var scene = Fifteen.scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 55, 1, 0.1, 1000 );

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(800, 800);
  $('#container').append(renderer.domElement);

  var directionalLight = new THREE.PointLight( 0x006600, 0.75 );
  directionalLight.position.set( 2, 2, 6 );
  scene.add( directionalLight );
  var light = new THREE.AmbientLight( 0x668866 );
  scene.add( light );


  // var geometry = new THREE.BoxGeometry( 5, 5, 1 );
  // var material = new THREE.MeshPhongMaterial( { color: 0x909090} );
  // var cube1 = new THREE.Mesh( geometry, material );
  // scene.add( cube1 );
  // var cube2 = new THREE.Mesh( geometry, material );
  // scene.add( cube2 );
  // cube2.position.x = 5;



  // camera.position.x = 7.5;
  // camera.position.y = -7.5;
  camera.position.z = 20;


  var render = Fifteen.render = function () {
    window.frame.refreshTileCoordinates();
    requestAnimationFrame( render );
    // cube1.rotation.x += 0.025;
    // cube1.rotation.y += 0.025;
    // cube2.rotation.x += 0.025;
    // cube2.rotation.y += 0.025;

    renderer.render(scene, camera);
  };


})();
