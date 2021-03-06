(function () {
  window.Fifteen = window.Fifteen || {};

  var scene = Fifteen.scene = new THREE.Scene();

  var $gamespace = $('#gamespace');
  $gamespace.click(onClick);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(600, 600);
  renderer.shadowMapEnabled = true;
  $gamespace.append(renderer.domElement);

  var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 300);
  camera.position.z = 25;

  var cameraControl = new THREE.OrbitControls(camera, document.getElementById('gamespace'));

  var spotLight = new THREE.SpotLight(0xeeeeee, 0.75);
  spotLight.position.set(-8, 8, 40);
  scene.add( spotLight );

  var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(-8, 8, 40);
  scene.add( directionalLight );

  function onClick(event) {
    if (window.frame.isSliding) { return; }

    var x = event.pageX - $gamespace.offset().left;
    var y = event.pageY - $gamespace.offset().top;
    var mouseX = 2 * (x / 600) - 1;
    var mouseY = 1 - 2 * ( y / 600 );

    var vector = new THREE.Vector3(mouseX, mouseY, camera.near);
    vector.unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(Fifteen.scene.children, true);

    if (intersects.length > 0) {
      iObjs = _.map(intersects, function (intersect) {
        return intersect.object.parent;
      });
      window.frame.handleClick(iObjs);
    }
  }

  var render = Fifteen.render = function () {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  };


})();
