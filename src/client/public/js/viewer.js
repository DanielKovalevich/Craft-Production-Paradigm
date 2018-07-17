'use strict';

/**
 * ================================================================
 *          INITIALIZE SCENE AND STATE VARIABLES
 * ================================================================
 */

if (!Detector.webgl)
  Detector.addGetWebGLMessage();
var container;
var camera, scene, renderer, controls;
var plane, cube;
var mouse, raycaster, isCtrlDown = false, isShiftDown = false;
var rollOverMesh, material, collisionBox;
var planeDimensions = 1000;
var group = new THREE.Group();

// Kicks off the program
$(function() {
  init();
  animate();
  render();
});

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  createGridAndPlane();
  //objects.push(plane);
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  addSceneLights();
  initCamera();
  // Event listeners
  /*
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('keydown', onDocumentKeyDown, false);
  document.addEventListener('keyup', onDocumentKeyUp, false);*/
  window.addEventListener('resize', onWindowResize, false);
}

// Initializes the camera -- Allows to use mouse wheel to zoom
function initCamera() {
  //camera = new THREE.PerspectiveCamera(60, window.innerWidth / (window.innerHeight + (window.innerHeight * .1)), 1, 10000);
  camera = new THREE.PerspectiveCamera(60, $('canvas').attr('width') / $('canvas').attr('height'), 1, 10000);
  camera.position.set(0, 500, 800);
  camera.lookAt(new THREE.Vector3());
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener( 'change', render );
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1;
  controls.panSpeed = 0.8;
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.enableDamping = false;
  controls.dampingFactor = 0.75;
  controls.minDistance = 200;
	controls.maxDistance = 2000;
}

function addSceneLights() {
  container = document.createElement('div');
  document.body.appendChild(container);
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
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() { renderer.render(scene, camera); }

function animate() {
  requestAnimationFrame(animate);
  controls.update();
}

function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / (window.innerHeight + (window.innerHeight * .15))) * 2 + 1);
  raycaster.setFromCamera(mouse, camera);
  render();
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / (window.innerHeight + (window.innerHeight * .15))) * 2 + 1);
  raycaster.setFromCamera(mouse, camera);
  render();
}

/**
 * ================================================================
 *          SCRIPTS FROM BRINGING IN THE MODEl
 * ================================================================
 */