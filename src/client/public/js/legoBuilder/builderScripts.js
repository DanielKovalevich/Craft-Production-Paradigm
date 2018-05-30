function loadRollOverMesh() {
  let loader = new THREE.STLLoader();
  let index = allModels.indexOf(currentObj);
  loader.load(allModels[index].directory, function (geometry) {
    geometry.computeBoundingBox();
    let material = new THREE.MeshPhongMaterial({ color: 0xC7C7C7, shininess: 30, specular: 0x111111 });
    rollOverMesh = new THREE.Mesh(geometry, material);
    scene.add(rollOverMesh);
    rollOverMesh.scale.set(currentObj.scale, currentObj.scale, currentObj.scale);
    rollOverMesh.rotation.x += -1.57;
    rollOverMesh.rotation.y += 0;
    rollOverMesh.rotation.z += 0;

    // generate collision box
    let box = new THREE.Box3().setFromObject(rollOverMesh);
    let size = new THREE.Vector3();
    box.getSize(size);

    rollOverMesh.userData.dimensions = size;
    rollOverMesh.name = 'rollOverMesh';

    rollOverMesh.position.y += determineModelYTranslation();
  });
}

/**
 * ================================================================
 *                  KEYBOARD AND MOUSE INPUT
 * ================================================================
 */

function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / (window.innerHeight + (window.innerHeight * .1))) * 2 + 1);
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(collisionObjects);
  if (intersects.length > 0) {
    // Need to load the rollOverMesh once the user enters the plane one again
    // this is to avoid lingering rollOverMeshes when you cycle through different pieces
    if (scene.children.indexOf(rollOverMesh) == -1) scene.add(rollOverMesh);
    else {
      let dim = rollOverMesh.userData.dimensions;
      var intersect = intersects[0];
      if (intersect.object.name == 'plane')  {
        changeObjPosOnPlane(rollOverMesh, intersect, dim);
        rollOverMesh.position.y = determineModelYTranslation();
      }
      else {
        rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
        // If I want to do snapping to grid, I need to figure out these numbers
        //rollOverMesh.position.divideScalar(dim.x).floor().multiplyScalar(dim.x).addScalar(dim.y / 2);
        let intersectY = intersect.object.userData.dimensions.y;
        rollOverMesh.position.y = intersectY + (intersect.point.y - intersectY) + determineModelYTranslation();
      }
    }
  }
  else {
    // solves issue that if you rapidly click the cylce button
    // it would place unremovable rollOverMeshes on the scene
    scene.children.forEach(element => {
      if (element.name == 'rollOverMesh')
        scene.remove(element);
    });
  }
  render(); 
}

// handles all the keyboard presses
// TODO: Handle multiple keypresses
function onDocumentKeyDown(event) {
  var vector = new THREE.Vector3();
  switch (event.keyCode) {
    case 16: // Shift
      isShiftDown = true; break;
    case 17: // Ctrl
      isCtrlDown = true; break;
    case 87: // W
      vector.set(0, 10, 0); break;
    case 65: // A
      vector.set(10, 0, 0); break;
    case 83: // S
      vector.set(0, -10, 0); break;
    case 68: // D
      vector.set(-10, 0, 0); break;
    case 81: // Q
      vector.set(0, 0, -10); break;
    case 69: // E
      vector.set(0, 0, 10); break;
    case 32: // Space
      controls.reset(); break;
  }
  camera.position.add(vector);
}

function onDocumentKeyUp(event) {
  switch (event.keyCode) {
    case 16: isShiftDown = false; break;
    case 17: isCtrlDown = false; break;
  }
}

/**
 * ================================================================
 *        CREATION AND DELETION OF THE MODELS IN THE SCENE
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
          if (intersect.object.children[1]) scene.remove(intersect.object.children[1]);
          scene.remove(intersect.object);
          scene.remove(intersect.object.children[0]);
          objects.splice(objects.indexOf(intersect.object.children[0]), 1);
          collisionObjects.splice(collisionObjects.indexOf(intersect.object), 1);
        }
      }
    }
    else if (isShiftDown) {
      placeLego(intersect);
    }
    render();
  }
}

/**
 * Handles placing the object on the scene and creating the collision object
 * @param {THREE.Intersection} intersect 
 */
function placeLego(intersect) {
  let loader = new THREE.STLLoader();
  let index = allModels.indexOf(currentObj);
  loader.load(allModels[index].directory, function (geometry) {
    geometry.computeBoundingBox();
    let material = new THREE.MeshPhongMaterial({color: 0xC7C7C7, shininess: 30, specular: 0x111111});
    let voxel = new THREE.Mesh(geometry, material);
    voxel.rotation.x += -1.57;
    voxel.rotation.y += 0;
    voxel.rotation.z += 0;
    voxel.scale.set(currentObj.scale,currentObj.scale,currentObj.scale);
    scene.add(voxel);

    let box = new THREE.Box3().setFromObject(voxel);
    let size = new THREE.Vector3();
    box.getSize(size);

    if (intersect.object.name == 'plane') {
      changeObjPosOnPlane(voxel, intersect, size);
      voxel.position.y += determineModelYTranslation();
    }
    else {
      /**
       * This is when an object is placed on another
       * Determines the face of the object then moves accordingly
       */
      console.log('object on object');
      let dim = intersect.face.normal;
      dim.normalize();
      //console.log(intersect.object.position, rollOverMesh.position, intersect.point);
      determineModelPosition(voxel, intersect, size, dim);
    }

    // Create the collision cube
    let geo = new THREE.BoxGeometry(size.x, size.y, size.z);
    let mat = new THREE.MeshBasicMaterial({color: 0x00ff00, visible: false});
    let cube = new THREE.Mesh(geo, mat);
    scene.add(cube);
    cube.position.copy(voxel.position);
    // some of these models are stupid and require special treatment ...
    cube.position.y -= determineModelYTranslation() - rollOverMesh.userData.dimensions.y / 2;
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
    cube.userData.dimensions = size;

    cube.children.push(voxel);
    cube.children.push(helper);
    objects.push(voxel);
  });
}

/**
 * Determines which face of the model the object is being placed on
 * and then adjusts the objects position in the scene accoridingly 
 * @param {THREE.Mesh} voxel 
 * @param {THREE.Intersection} intersect 
 * @param {THREE.Vector3} size 
 * @param {THREE.Vector3} dim 
 */
function determineModelPosition(voxel, intersect, size, dim) {
  let rollPos = rollOverMesh.position;
  let interPos = intersect.object.position;

  if (dim.z == 1) {
    voxel.position.z = interPos.z + size.z;
    voxel.position.y = rollPos.y;
    voxel.position.x = rollPos.x;
  }
  else if (dim.x == 1) {
    voxel.position.x = interPos.x + size.x;
    voxel.position.y = rollPos.y;
    voxel.position.z = rollPos.z;
  }
  else if (dim.y == 1) {
    voxel.position.y = currentObj.yTranslation ? rollPos.y : size.y + (size.y / 2) + interPos.y;
    voxel.position.x = rollPos.x;
    voxel.position.z = rollPos.z;
  }
  else if (dim.z == -1) {
    voxel.position.z = interPos.z - size.z;
    voxel.position.y = rollPos.y;
    voxel.position.x = rollPos.x;
  }
  else if (dim.x == -1) {
    voxel.position.x = interPos.x - size.x;
    voxel.position.y = rollPos.y;
    voxel.position.z = rollPos.z;
  }
  else {
    voxel.position.y = interPos.y - (size.y / 2) - size.y;
    voxel.position.x = rollPos.x;
    voxel.position.z = rollPos.z;
  }
}

/**
 * A lot of the models have different center points
 * so I need to make sure all they link correctly with the plane and other modles
 */
function determineModelYTranslation() {
  // whoever made these retarded models needs to learn about consistency
  if (currentObj.name == 'steering') {
    return rollOverMesh.userData.dimensions.y / 2 - 9;
  }
  switch(currentObj.yTranslation) {
    case 1: return rollOverMesh.userData.dimensions.y - 5;
    case 0: return rollOverMesh.userData.dimensions.y / 2;
    case -1: return 0;
  }
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
  let index = allModels.indexOf(currentObj);
  currentObj = ++index == allModels.length ? allModels[0] : allModels[index];
  loadRollOverMesh();
 }

 function getModel(name) {
   allModels.forEach((element) => {
    if (element.name == name) currentObj = element;
   });
   loadRollOverMesh();
 }