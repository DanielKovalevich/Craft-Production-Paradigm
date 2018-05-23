'use strict';
if (!Detector.webgl)
  Detector.addGetWebGLMessage();
var container;
var camera, scene, renderer, controls;
var plane, cube;
var mouse, raycaster, isCtrlDown = false;
var rollOverMesh, material, collisionBox;
var planeDimensions = 1000;
var objects = [], collisionObjects = [];

var currentObj = 'twoByTwo';
var directories = {
  lego_man: '../objects/lego_man.stl',
  oneByOne: '../objects/1x1.stl',
  twoByTwo: '../objects/2x2.stl'
}
var pieces = ['lego_man', 'oneByOne', 'twoByTwo'];

init();
animate();
render();

function init() {
  generateHeaderInfo();
  initCamera();
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  createGridAndPlane();
  //objects.push(plane);
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

function createGridAndPlane() {
  var gridHelper = new THREE.GridHelper(1000, 40);
  scene.add(gridHelper);
  var geometry = new THREE.PlaneBufferGeometry(planeDimensions, planeDimensions);
  geometry.rotateX(-Math.PI / 2);
  plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({visible: false}));
  plane.name = 'plane';
  scene.add(plane);
  collisionObjects.push(plane);
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
  var intersects = raycaster.intersectObjects(collisionObjects);
  if (intersects.length > 0) {
    // Need to load the rollOverMesh once the user enters the plane one again
    // this is to avoid lingering rollOverMeshes when you cycle through different pieces
    if (!rollOverMesh) loadRollOverMesh();
    else {
      let dim = rollOverMesh.userData.size;
      var intersect = intersects[0];
      if (intersect.object.name == 'plane') 
        changeObjPosOnPlane(rollOverMesh, intersect, dim);
      else {
        rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
        // If I want to do snapping to grid, I need to figure out these numbers
        //rollOverMesh.position.divideScalar(dim.x).floor().multiplyScalar(dim.x).addScalar(dim.y / 2);
        rollOverMesh.position.y += dim.y / 2;
      }
    }
  }
  else {
    scene.remove(rollOverMesh);
    rollOverMesh = null;
  }
  render(); 
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

function loadRollOverMesh() {
  let loader = new THREE.STLLoader();
  loader.load(directories[currentObj], function (geometry) {
    geometry.computeBoundingBox();
    let material = new THREE.MeshPhongMaterial({ color: 0xC7C7C7, shininess: 30, specular: 0x111111 });
    rollOverMesh = new THREE.Mesh(geometry, material);
    scene.add(rollOverMesh);
    rollOverMesh.scale.set(3, 3, 3);
    rollOverMesh.rotation.x += -1.60;
    rollOverMesh.rotation.y += 0;
    rollOverMesh.rotation.z += 0;

    // generate collision box
    let box = new THREE.Box3().setFromObject(rollOverMesh);
    let size = new THREE.Vector3();
    box.getSize(size);

    rollOverMesh.position.y += size.y;
    rollOverMesh.userData.size = size;
  });
}

/**
 * ================================================================
 * Functions below deal with the creation and deletion of the legos
 * ================================================================
 * 
 */

function onDocumentMouseDown(event) {
  event.preventDefault();
  mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / (window.innerHeight + (window.innerHeight * .1))) * 2 + 1);
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(collisionObjects);
  var objIntersect = raycaster.intersectObjects(objects);
  if (intersects.length > 0 || objIntersect.length > 0) {
    var intersect = intersects[0];
    var objIntersect = objIntersect[0];
    // delete cube
    if (isCtrlDown) {
      // FIXME: Bug that doesn't delete object if collision object has been already deleted
      if (intersect.object != plane) {
        if (intersect) {
          scene.remove(intersect.object); 
          collisionObjects.splice(collisionObjects.indexOf(intersect.object), 1);
        }
        if (objIntersect) {
          scene.remove(objIntersect.object);
          objects.splice(objects.indexOf(objIntersect.object), 1);
        }
      }
    }
    else {
      placeLego(intersect);
    }
    render();
  }
}

function placeLego(intersect) {
  let loader = new THREE.STLLoader();
  loader.load(directories[currentObj], function (geometry) {
    geometry.computeBoundingBox();
    let material = new THREE.MeshPhongMaterial({ color: 0xC7C7C7, shininess: 30, specular: 0x111111 });
    let voxel = new THREE.Mesh(geometry, material);
    voxel.rotation.x += -1.60;
    voxel.rotation.y += 0;
    voxel.rotation.z += 0;
    voxel.scale.set(3,3,3);

    /*console.log("----------------------INTERSECT-----------------------");
    console.log(intersect);
    console.log(intersect.face);
    console.log("----------------------INTERSECT-----------------------");*/

    scene.add(voxel);

    let box = new THREE.Box3().setFromObject(voxel);
    let size = new THREE.Vector3();
    box.getSize(size);

    // QUICK MAFFS
    if (intersect.object.name == 'plane') {
      changeObjPosOnPlane(voxel, intersect, size);
      voxel.position.y += size.y;
    }
    else {
      /**
       * This is when an object is placed on another
       * Determines the face of the object then moves accordingly
       */
      console.log('object on object');
      voxel.position.copy(intersect.object.position);
      let dim = intersect.face.normal;
      dim.normalize();
      if (dim.z == 1) voxel.position.z += size.z;
      else if (dim.x == 1) voxel.position.x += size.x;
      else if (dim.y == 1) voxel.position.y += size.y;
      else if (dim.z == -1) voxel.position.z -= size.z;
      else if (dim.x == -1) voxel.position.x -= size.x;
      else voxel.position.y -= size.y;
      console.log(size);
      voxel.position.y += Math.floor(size.y / 2);
    }

    // Create the collision cube
    let geo = new THREE.BoxGeometry(size.x, size.y, size.z);
    let mat = new THREE.MeshBasicMaterial({color: 0x00ff00, visible: false});
    let cube = new THREE.Mesh(geo, mat);
    scene.add(cube);
    cube.position.copy(voxel.position);
    cube.position.y -= size.y / 2;
    collisionObjects.push(cube);

    // TODO: Remove this when I finish these functions
    let helper = new THREE.BoxHelper(cube, 0xff0000);
    helper.update();
    // visible bounding box
    scene.add(helper);
    
    // add names to all of the objects for debugging purposes
    voxel.name = 'obj' + objects.length;
    cube.name = voxel.name + '.collisionObj';
    helper.name = voxel.name + ".helper";

    cube.children.push(voxel);

    /*
    console.log('----------------Testing------------------');
    console.log(voxel);
    console.log(cube);
    console.log('----------------Testing------------------');
    */

    objects.push(voxel);
  });
}

/**
 * Changes position of passed in object so that it snaps to grid
 * This is to avoid overlapping that can happen if two objects are too close
 * This allows the plane to handle the different sized legos
 * @param {THREE.Mesh} obj 
 * @param {THREE.Object3D} intersect
 * @param {THREE.Vector3} size
 */
function changeObjPosOnPlane(obj, intersect, size) {
  // QUICK MAFFS
  let normalizedCoord = {};
  normalizedCoord.x = Math.floor(intersect.point.x);
  normalizedCoord.z = Math.floor(intersect.point.z);
  normalizedCoord.x += normalizedCoord.x < 0 ? size.x / 2 : size.x / -2;
  normalizedCoord.z += normalizedCoord.z < 0 ? size.z / 2 : size.z / -2;
  normalizedCoord.x = Math.floor(normalizedCoord.x / size.x);
  normalizedCoord.z = Math.floor(normalizedCoord.z / size.z);
  //obj.position.copy(intersect.point).add(intersect.face.normal);
  obj.position.x = size.x / 2 + size.x * normalizedCoord.x;
  obj.position.z = size.z / 2 + size.z * normalizedCoord.z;
}

/**
 * ================================================================
 *                    HTML BUTTOM FUNCTIONS
 * ================================================================
 */

 function cycle() {
  let index = pieces.indexOf(currentObj);
  currentObj = ++index == pieces.length ? pieces[0] : pieces[index];
  loadRollOverMesh();
 }