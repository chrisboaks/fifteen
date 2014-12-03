// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 0.1, 1000 );
// var directionalLight = new THREE.PointLight( 0x006600, 0.75 );
// directionalLight.position.set( 2, 2, 6 );
// scene.add( directionalLight );
// var light = new THREE.AmbientLight( 0x668866 ); // soft white light
// scene.add( light );
//
// var renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );


(function () {

  window.Fifteen = window.Fifteen || {};

  var scene = Fifteen.scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 60, 1, 0.1, 1000 );
  var renderer = new THREE.WebGLRenderer();
  var $container = $('#container');

  scene.add(camera);
  camera.position.z = 10;
  renderer.setSize(800, 800);

  $container.append(renderer.domElement);
  camera.position.z = 20;

  var geometry = new THREE.BoxGeometry( 5, 5, 5 );
  var material = new THREE.MeshPhongMaterial( { color: 0x909090} );
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube );
  console.log(cube);

  var render = Fifteen.render = function () {
    requestAnimationFrame( render );

    // dodecahedron.rotation.x += 0.025;
    // dodecahedron.rotation.y += 0.025;
    //
    // cylinder.rotation.x += 0.005;
    // cylinder.rotation.y += 0.025;
    // cylinder.rotation.z += 0.025;
    //
    //
    // cube.rotation.x += 0.025;
    // cube.rotation.y += 0.025;

    renderer.render(scene, camera);
  };


})();
