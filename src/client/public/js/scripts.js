'use strict';
if (!Detector.webgl)
  Detector.addGetWebGLMessage();
var container;
var camera, scene, renderer, controls;
var plane, cube;
var mouse, raycaster, isCtrlDown = false;
var rollOverMesh, material, collisionBox;
var cubeGeo, cubeMaterial;
var objects = [];

var currentObj = 'twoByTwo';
var directories = {
  lego_man: '../objects/lego_man.stl',
  oneByOne: '../objects/1x1.stl',
  twoByTwo: '../objects/2x2.stl'
}

init();
animate();
render();

function init() {
  generateHeaderInfo();
  initCamera();
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  // roll-over helpers
  let loader = new THREE.STLLoader();
  loader.load(directories[currentObj], function (geometry) {
    geometry.computeBoundingBox();
    let material = new THREE.MeshPhongMaterial({ color: 0xC7C7C7, shininess: 30, specular: 0x111111 });
    rollOverMesh = new THREE.Mesh(geometry, material);
    scene.add(rollOverMesh);
    console.log(rollOverMesh);
    rollOverMesh.scale.set(3, 3, 3);
    rollOverMesh.rotation.x += -1.60;
    rollOverMesh.rotation.y += 0;
    rollOverMesh.rotation.z += 0;
    rollOverMesh.position.z += 50;

    var rollOverGeo = new THREE.BoxGeometry(25, 25, 25);
    var collisionMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, opacity: .15, transparent: true });
    collisionBox = new THREE.Mesh(rollOverGeo, collisionMaterial);
    scene.add(collisionBox);
    collisionBox.position.set(0, 40, 0);
  });

  
  // cubes
  cubeGeo = new THREE.BoxGeometry(25, 25, 25);
  cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xC7C7C7 });
  // grid
  var gridHelper = new THREE.GridHelper(1000, 40);
  scene.add(gridHelper);
  //
  var geometry = new THREE.PlaneBufferGeometry(1000, 1000);
  geometry.rotateX(-Math.PI / 2);
  plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
  scene.add(plane);
  objects.push(plane);
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  addSceneLights();
  // Event listeners
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('keydown', onDocumentKeyDown, false);
  document.addEventListener('keyup', onDocumentKeyUp, false);
  window.addEventListener('resize', onWindowResize, false);
}

// Initializes the camera -- Allows to use mouse wheel to zoom
function initCamera() {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / (window.innerHeight + (window.innerHeight * .1)), 1, 10000);
  camera.position.set(0, 500, 800);
  camera.lookAt(new THREE.Vector3());
  controls = new THREE.TrackballControls(camera);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;
  controls.keys = [65, 83, 68];
  controls.addEventListener('change', render);
}

// Adds header information at the top of the page
function generateHeaderInfo() {
  container = document.createElement('div');
  document.body.appendChild(container);
  var info = document.createElement('div');
  info.style.position = 'relative';
  info.style.backgroundColor = '0xf0f0f0';
  //info.style.top = '10px';
  info.style.width = '100%';
  info.style.textAlign = 'center';
  info.innerHTML = '<a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> - lego painter - webgl<br><strong>click</strong>: add voxel, <strong>ctrl + click</strong>: remove voxel';
  container.appendChild(info);
}

function addSceneLights() {
  var ambientLight = new THREE.AmbientLight(0x606060);
  scene.add(ambientLight);
  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 0.75, 0.5).normalize();
  scene.add(directionalLight);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / (window.innerHeight + (window.innerHeight * .1));
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / (window.innerHeight + (window.innerHeight * .1))) * 2 + 1);
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(objects);
  if (intersects.length > 0) {
    var intersect = intersects[0];
    rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
    collisionBox.position.copy(intersect.point).add(intersect.face.normal);
    rollOverMesh.position.divideScalar(25).floor().multiplyScalar(25).addScalar(12.5);
    rollOverMesh.position.y += 25;
    collisionBox.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
  }
  render();
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / (window.innerHeight + (window.innerHeight * .1))) * 2 + 1);
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(objects);
  if (intersects.length > 0) {
    var intersect = intersects[0];
    // delete cube
    if (isCtrlDown) {
      if (intersect.object != plane) {
        scene.remove(intersect.object);
        objects.splice(objects.indexOf(intersect.object), 1);
      }
      // create cube
    }
    else {
      /*
      var voxel = new THREE.Mesh(rollOverMesh, cubeMaterial);
      voxel.position.copy(intersect.point).add(intersect.face.normal);
      voxel.position.divideScalar(25).floor().multiplyScalar(25).addScalar(12.5);
      scene.add(voxel);
      objects.push(voxel);*/
      let loader = new THREE.STLLoader();
      loader.load(directories[currentObj], function (geometry) {
        geometry.computeBoundingSphere();
        let material = new THREE.MeshPhongMaterial({ color: 0xC7C7C7, shininess: 30, specular: 0x111111 });
        let voxel = new THREE.Mesh(geometry, material);
        voxel.rotation.x += -1.60;
        voxel.rotation.y += 0;
        voxel.rotation.z += 0;
        voxel.scale.set(3,3,3);

        voxel.position.copy(intersect.point).add(intersect.face.normal);
        voxel.position.divideScalar(25).floor().multiplyScalar(25).addScalar(12.5);
        voxel.position.y += 25;

        scene.add(voxel);
        objects.push(voxel);
      });
    }
    render();
  }
}

// handles all the keyboard presses
// TODO: Handle multiple keypresses
function onDocumentKeyDown(event) {
  var vector = new THREE.Vector3();
  switch (event.keyCode) {
    case 17: isCtrlDown = true; break;     // Shift
    case 87: vector.set(0, 10, 0); break;  // W
    case 65: vector.set(10, 0, 0); break;  // A
    case 83: vector.set(0, -10, 0); break; // S
    case 68: vector.set(-10, 0, 0); break; // D
    case 81: vector.set(0, 0, -10); break; // Q
    case 69: vector.set(0, 0, 10); break;  // E
    case 32: controls.reset(); break;      // Space
  }
  camera.position.add(vector);
}
function onDocumentKeyUp(event) {
  switch (event.keyCode) {
    case 17:
      isCtrlDown = false;
      break;
  }
}
function render() {
  renderer.render(scene, camera);
}
function animate() {
  requestAnimationFrame(animate);
  controls.update();
}
