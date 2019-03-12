'use strict'
let currentRollOverModel = "";

function loadRollOverMesh() {
  let loader = new THREE.STLLoader();
  let index = allModels.indexOf(currentObj);
  loader.load(allModels[index].directory, function (geometry) {
    geometry.computeBoundingBox();
    let material = new THREE.MeshPhongMaterial({ color: colors[index], shininess: 30, specular: 0x111111 });
    rollOverMesh = new THREE.Mesh(geometry, material);
    scene.add(rollOverMesh);
    rollOverMesh.scale.set(currentObj.scale, currentObj.scale, currentObj.scale);
    rollOverMesh.rotation.x += - Math.PI / 2;

    // so some of these models are really dumb
    // i need to manually fix the positioning of them
    //if (currentObj == twoByThreeByTwo) rollOverMesh.position.x -= 15;

    // generate collision box
    let box = new THREE.Box3().setFromObject(rollOverMesh);
    let size = new THREE.Vector3();
    box.getSize(size);

    currentRollOverModel = allModels[index].name;
    rollOverMesh.userData.dimensions = size;
    rollOverMesh.userData.modelType = currentRollOverModel;
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
  mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / (window.innerHeight + (window.innerHeight * .15))) * 2 + 1);
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(collisionObjects);
  pieceIndex = names.indexOf(currentRollOverModel);
  if (pieceIndex != -1) {
    if (pieces[pieceIndex] == 0) {
      currentRollOverModel = "";
      scene.remove(rollOverMesh);
    }
    clearPreviousRollOverObject();
    if (intersects.length > 0 && currentRollOverModel != "") {
      // Need to load the rollOverMesh once the user enters the plane one again
      // this is to avoid lingering rollOverMeshes when you cycle through different pieces
      if (scene.children.indexOf(rollOverMesh) == -1) scene.add(rollOverMesh);
      else {
        let dim = rollOverMesh.userData.dimensions;
        var intersect = intersects[0];
        if (intersect.object.name == 'plane')  {
          //changeObjPosOnPlane(rollOverMesh, intersect, dim);
          rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
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
  }
  render(); 
}

// handles all the keyboard presses
// TODO: Handle multiple keypresses
function onDocumentKeyDown(event) {
  var vector = new THREE.Vector3();
  switch (event.keyCode) {
    case 16: isShiftDown = true; break; // Shift
    case 17: isCtrlDown = true; break;  // Ctrl
    case 87: vector.set(0, 10, 0); break;  // W
    case 65: vector.set(10, 0, 0); break;  // A
    case 83: vector.set(0, -10, 0); break; // S
    case 68: vector.set(-10, 0, 0); break; // D
    case 81: rollOverMesh.rotation.z += Math.PI / 2; render(); break; // Q
    case 69: rollOverMesh.rotation.z -= Math.PI / 2; render(); break; // E
    case 32: controls.reset(); break;   // Space
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
  mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / (window.innerHeight + (window.innerHeight * .15))) * 2 + 1);
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(collisionObjects);
  var objIntersect = raycaster.intersectObjects(objects);
  if (intersects.length > 0 || objIntersect.length > 0) {
    var intersect = intersects[0];
    var objIntersect = objIntersect[0];
    pieceIndex = names.indexOf(currentRollOverModel);
    // delete cube
    if (isCtrlDown) {
      if (intersect.object != plane) {
        if (intersect) {
          if (intersect.object.children[1]) scene.remove(intersect.object.children[1]);
          scene.remove(intersect.object);
          scene.remove(intersect.object.children[0]);
          objects.splice(objects.indexOf(intersect.object.children[0]), 1);
          collisionObjects.splice(collisionObjects.indexOf(intersect.object), 1);
          // I get this kind of shit when I forget to actually design some parts
          // It's also because some parts of JS can be "interesting"
          let index = names.indexOf(intersect.object.children[0].userData.modelType);
          pieces[index] = parseInt(pieces[index]) + 1;
          // It's about as stupid as it looks
          // this is because the intersection object is the collision object
          group.remove(intersect.object.children[0]);
          updatePieces();
        }
      }
    }
    else if (isShiftDown && pieces[pieceIndex] > 0) {
      placeLego(intersect, placement => {
        if (placement) {
          pieces[pieceIndex] = parseInt(pieces[pieceIndex]) - 1;
          updatePieces();
        }
      });
    }
    render();
  }
}

/**
 * There is a bug when changing rollOverMeshes where there will be more than one on the scene at the same time
 */
function clearPreviousRollOverObject() {
  scene.children.forEach(elem => {
    if (elem.name == 'rollOverMesh' && elem.userData.modelType != currentRollOverModel)
      scene.remove(elem);
  });
}

/**
 * Handles placing the object on the scene and creating the collision object
 * @param {THREE.Intersection} intersect
 * @param {function} cb this is to return whether or not the object has been placed
 */
function placeLego(intersect, cb) {
  let placementPossible = true;
  let loader = new THREE.STLLoader();
  let index = allModels.indexOf(currentObj);
  loader.load(allModels[index].directory, function (geometry) {
    // i wanted to break up this function so i needed to pass these variables by reference
    let modelObj = {}, size = {};
    generateObjFromModel(geometry, modelObj, size);
    size = size.size;
    modelObj = modelObj.mesh;
    modelObj.userData.modelType = currentRollOverModel;

    if (intersect.object.name == 'plane') {
      //changeObjPosOnPlane(modelObj, intersect, size);
      let mName = currentRollOverModel.split(' ');
      if (mName[0] != 'Rim' && mName[0] != 'Tire') {
        modelObj.position.copy(intersect.point).add(intersect.face.normal);
        modelObj.position.y += determineModelYTranslation();
      }
      else {
        placementPossible = false;
      }
    }
    else {
      let dim = intersect.face.normal;
      dim.normalize();
      // TODO: THERE SEEMS TO BE A PROBLEM WITH A SLIGHTLY LOWER PLACEMENT THAN IT SHOULD BE
      let iName = intersect.object.userData.obj.name.split(' ');
      let mName = currentRollOverModel.split(' ');

      // this is lazy programming. i don't want to handle the array bounds
      // i did this all already in a better manner but it was lost with my desktop. RIP
      if ((iName[1] == 'Pin' || iName[1] == 'Double' || iName[0] == 'Rim') && (mName[0] == 'Rim' || mName[0] == 'Tire')) {
        placementPossible = determineWheelPosition(modelObj, intersect, dim);
      }
      else {
        placementPossible = determineModelPosition(modelObj, intersect, size, dim);
      }
    }

    // If the piece can't be placed on another, I don't want it to create and add the modelObj to the scene
    if (placementPossible) {
      generateCollisionCube(modelObj, size);
    }

    cb(placementPossible);

      /**POSITIONAL SNAPPING FOR LEGO PLACEMENTS*/
      let bSize = modelObj.width;
      let x = modelObj.position.x;
      let y = modelObj.position.y;
      if((x % bSize) < (.5*bSize)){
          modelObj.position.x = x-(x%bSize);
      }
      else if((x % bSize) > (.5*bSize)){
          modelObj.position.x = x+(x%bSize);
      }
      /**end of positional snapping algorithm*/
  });
}

/**
 * The STLloader gets the model and turns it into a THREE.Geometry.
 * This function turns the geometry into a mesh and determines the size
 * @param {THREE.Geometry} geometry 
 * @param {THREE.MESH} modelObj 
 * @param {THREE.Vector3} size 
 */
function generateObjFromModel(geometry, modelObj, size) {
  geometry.computeBoundingBox();
  let material = new THREE.MeshPhongMaterial({color: colors[allModels.indexOf(currentObj)], shininess: 30, specular: 0x111111});
  modelObj.mesh = new THREE.Mesh(geometry, material);
  modelObj.mesh.rotation.x = rollOverMesh.rotation.x;
  modelObj.mesh.rotation.y = rollOverMesh.rotation.y;
  modelObj.mesh.rotation.z = rollOverMesh.rotation.z;
  modelObj.mesh.scale.set(currentObj.scale,currentObj.scale,currentObj.scale);
  scene.add(modelObj.mesh);
  group.add(modelObj.mesh);
  let box = new THREE.Box3().setFromObject(modelObj.mesh);
  size.size = new THREE.Vector3();
  box.getSize(size.size);
}

/**
 * Generates the collision box around the mesh
 * TODO: Fix the sizing of the collision boxes
 * @param {THREE.Mesh} modelObj 
 * @param {THREE.Vector3} size 
 */
function generateCollisionCube(modelObj, size) {
  // turns out these aren't 0 by default and caused me so much trouble until i did this
  let yModifier = currentObj.collisionY ? currentObj.collisionY : 0;
  let zModifier = currentObj.collisionZ ? currentObj.collisionZ : 0;
  let xModifier = currentObj.collisionX ? currentObj.collisionX : 0;

  // Create the collision cube
  let geo = new THREE.BoxGeometry(size.x, size.y - yModifier, size.z - zModifier);
  let mat = new THREE.MeshBasicMaterial({color: 0x00ff00, visible: false});
  let cube = new THREE.Mesh(geo, mat);
  scene.add(cube);

  fixModelCollisionPosition(cube, modelObj, size, xModifier, yModifier, zModifier);
  collisionObjects.push(cube);

  /* This creates a bounding box around the collision cube. 
  let helper = new THREE.BoxHelper(cube, 0xff0000);
  helper.update();
  // visible bounding box
  scene.add(helper);
  helper.name = modelObj.name + ".helper";
  cube.children.push(helper);  
  */

  // add names to all of the objects for debugging purposes
  modelObj.name = 'obj' + objects.length;
  cube.name = modelObj.name + '.collisionObj';

  cube.userData.dimensions = size;
  cube.userData.obj = currentObj;
  cube.userData.rotation = (modelObj.rotation.z / (Math.PI / 2)) % 4;

  cube.children.push(modelObj);
  objects.push(modelObj);
}

/**
 * Determines which face of the model the object is being placed on
 * and then adjusts the objects position in the scene accoridingly 
 * @param {THREE.Mesh} modelObj 
 * @param {THREE.Intersection} intersect 
 * @param {THREE.Vector3} size 
 * @param {THREE.Vector3} dim 
 */
function determineModelPosition(modelObj, intersect, size, dim) {
  let rollPos = rollOverMesh.position;
  let interPos = intersect.object.position;
  let collisionModel = intersect.object.userData.obj;
  let rotation = (modelObj.rotation.z / (Math.PI / 2)) % 4;

  let rotationMatrix = determineRotationMatrix(intersect, rotation);

  if (dim.z == 1 && rotationMatrix[0] == 1) {
    modelObj.position.z = interPos.z + size.z;
    modelObj.position.y = rollPos.y;
    modelObj.position.x = rollPos.x;
  }
  else if (dim.x == 1 && rotationMatrix[1] == 1) {
    modelObj.position.x = interPos.x + size.x;
    modelObj.position.y = rollPos.y;
    modelObj.position.z = rollPos.z;
  }
  else if (dim.y == 1 && collisionModel.top == 1) {
    // i honestly don't remember why i need to do this
    // stupid models are never consistent
    if (currentObj.name == 'Steering Wheel')
      modelObj.position.y = rollPos.y;
    else
      modelObj.position.y = currentObj.yTranslation ? rollPos.y : size.y + (size.y / 2) + interPos.y;
    modelObj.position.x = rollPos.x;
    modelObj.position.z = rollPos.z;
  }
  else if (dim.z == -1 && rotationMatrix[2] == 1) {
    modelObj.position.z = interPos.z - size.z;
    modelObj.position.y = rollPos.y;
    modelObj.position.x = rollPos.x;
  }
  else if (dim.x == -1 && rotationMatrix[3] == 1) {
    modelObj.position.x = interPos.x - size.x;
    modelObj.position.y = rollPos.y;
    modelObj.position.z = rollPos.z;
  }
  else if (dim.y == -1 && collisionModel.bottom == 1) {
    modelObj.position.y = interPos.y - (size.y / 2) - size.y;
    modelObj.position.x = rollPos.x;
    modelObj.position.z = rollPos.z;
  }
  else {
    scene.remove(modelObj);
    return false;
  }

  return true;
}

/**
 * The wheel position needs to be determined separately as 
 * the interaction between the pins, tires, and rims act differently
 * @param {*} modelObj 
 * @param {*} intersect
 * @param {*} dim 
 */
function determineWheelPosition(modelObj, intersect, dim) {
  let interPos = intersect.object.position;
  let collisionModel = intersect.object.userData.obj;
  let rotation = (modelObj.rotation.z / (Math.PI / 2)) % 4;
  let rotationMatrix = determineRotationMatrix(intersect, rotation);  

  let typeColl = collisionModel.name.split(' ');
  let typeModel = modelObj.userData.modelType.split(' ');
  if (typeColl.length == 1) {
    scene.remove(modelObj);
    return false;
  }

  if ((typeColl[1] == 'Pin' || typeColl[1] == 'Double') && typeModel[0] == 'Rim') {
    return attachRimToPin(modelObj, intersect, dim);
  }

  if (typeColl[0] == 'Rim' && typeModel[0] == 'Tire' && typeColl[1] == typeModel[1]) {
    return attachTireToRim(modelObj, intersect, dim);
  }

  scene.remove(modelObj);
  return false;
}

function attachRimToPin(modelObj, intersect, dim) {
  let collisionPos = intersect.object.position;
  let dimensions = intersect.object.userData.dimensions;
  if (Math.abs(dim.z) == 1 || Math.abs(dim.x) == 1) {
    modelObj.position.x = dim.x != 0 ? collisionPos.x + dimensions.x / 2 * dim.x : collisionPos.x;
    modelObj.position.y = collisionPos.y;
    modelObj.position.z = dim.z != 0 ? collisionPos.z + dimensions.z / 2 * dim.z : collisionPos.z;
  }
  else {
    scene.remove(modelObj);
    return false;
  }
  return true;
}

function attachTireToRim(modelObj, intersect, dim) {
  let collisionPos = intersect.object.position;
  if (Math.abs(dim.z) == 1 || Math.abs(dim.x) == 1) {
    modelObj.position.y = collisionPos.y;
    modelObj.position.x = collisionPos.x;
    modelObj.position.z = collisionPos.z;
  }
  else {
    scene.remove(modelObj);
    return false;
  }
  return true;
}

/**
 * The models have the possiblePlacement attributes that are relative to the global orientation
 * so when the objects get rotated, their placement attributes do not. 
 * I rotate them so that the placement attributes match the objects orientation
 * @param {THREE.Intersection} intersect 
 * @param {Number} rotation 
 */
function determineRotationMatrix(intersect, rotation) {
  let userData = intersect.object.userData.obj;
  let possiblePlacement = [userData.front, userData.right, userData.back, userData.left];
  let adjustedArray = [];

  possiblePlacement.forEach((elem, i) => {
    adjustedArray[mod(i + rotation, possiblePlacement.length)] = elem;
  });
  
  return adjustedArray;
}

/**
 * Apparently Javascript is super dumb and doesn't want to handle negative modulo operations
 * @param {Number} m
 * @param {Number} n
 */
function mod(n, m) {
  return (((n % m) + m) % m);
}

/**
 * A lot of the models have different center points
 * so I need to make sure all they link correctly with the plane and other models
 */
function determineModelYTranslation() {
  // whoever made these retarded models needs to learn about consistency
  let y = rollOverMesh.userData.dimensions.y;
  switch(currentObj.name) {
    case 'Steering Wheel': return y / 2 - 9;
    case '2x3x2': return y - 7;
    case 'Tire 1':
    case 'Tire 2':
    case 'Tire 3':
    case 'Rim 1':
    case 'Rim 2':
    case 'Rim 3': return y / 2 + 2;
  }
  switch(currentObj.yTranslation) {
    case 1: return y - 5.5;
    case 0: return y / 2;
    case -1: return 0;
  }
}

function fixModelCollisionPosition(cube, modelObj, size, xModifier, yModifier, zModifier) {
  cube.position.copy(modelObj.position);
  // some of these models are stupid and require special treatment ...
  cube.position.y -= determineModelYTranslation() - size.y / 2 + yModifier - 2;
  // i swear ... i should have modeled these pieces myself
  if (Math.abs(modelObj.rotation.z) % Math.PI == 0) {
    // some models need to have their collision cube rotated
    let multiplier = Math.floor(modelObj.rotation.z / Math.PI) % 2 != 0 ? -1 : 1;
    switch(modelObj.userData.modelType) {
      case '2x3x2': cube.position.x += (size.x / 2 - xModifier) * multiplier; break;
      case '1x2 Pin': cube.position.z += (size.z / 2 - 12) * multiplier; break;      
      case '2x2 Pin': cube.position.x += (size.x / 6 - 3) * multiplier; break;
      case '2x2x2 Pin': cube.position.x += (size.x / 6) * multiplier; break;
      case 'Windshield': cube.position.z += (size.z / 4) * multiplier; break;
      case 'Lego Man': cube.position.z += 2 * multiplier; break;
    }
  }
  else {
    let multiplier = Math.floor((modelObj.rotation.z / (Math.PI / 2) - 1) / 2) % 2 != 0 ? -1 : 1;
    switch(modelObj.userData.modelType) {
      case '2x3x2': cube.position.z -= (size.z / 2 - xModifier) * multiplier; break;
      case '1x2 Pin': cube.position.x += (size.x / 2 - 12) * multiplier; break;
      case '2x2 Pin': cube.position.z -= (size.z / 6 - 3) * multiplier; break;
      case '2x2x2 Pin': cube.position.z -= (size.z / 6) * multiplier; break;
      case 'Windshield': cube.position.x += (size.x / 4) * multiplier; break;
      case 'Lego Man': cube.position.x += 2 * multiplier; break;
    }
  }
}


// I decided that I didn't really like the snapping
// I might come back to it later though
/**
 * Changes position of passed in object so that it snaps to grid
 * This is to avoid overlapping that can happen if two objects are too close
 * This allows the plane to handle the different sized legos
 * @param {THREE.Mesh} obj 
 * @param {THREE.Object3D} intersect
 * @param {THREE.Vector3} size
 */
/*
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
*/