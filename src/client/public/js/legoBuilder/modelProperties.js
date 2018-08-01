'use strict'

/**
 * name: String 
 *  -> Holds the name of the object
 * directory: String 
 *  -> Points to the directory of the model
 * scale: Integer
 *  -> Some models are scaled differently than others
 * yTranslation: Boolean 
 *  -> Some models have the center at different places
 *  -> In this case 1 is the top, 0 is the middle, and -1 is the bottom
 * top, bottom, front, back, left, right: Boolean
 *  -> Most pieces can only be put together by a few of the surfaces
 * collisionX, collisionY, collisionZ: Doubles
 *  -> All of the models need to have their collision boxes resized
 *  -> These values are modifiers that are subtracted from the original model's size
 */

function Model(name, directory, scale, yTranslation, top, bottom, front, back, left, right, collisionX, collisionY, collisionZ) {
  this.name = name;
  this.directory = directory;
  this.scale = scale
  this.yTranslation = yTranslation;
  this.top = top;
  this.bottom = bottom;
  this.front = front;
  this.back = back;
  this.left = left;
  this.right = right;
  this.collisionX = collisionX;
  this.collisionY = collisionY;
  this.collisionZ = collisionZ;
};

const oneByOne = new Model('1x1', '../objects/1x1.stl', 3, 1, 1, 1, 0, 0, 0, 0, 0, 5, 0);
const twoByTwo = new Model('2x2', '../objects/2x2.stl', 3, 1, 1, 1, 0, 0, 0, 0, 0, 5, 0);
const twoByThreeByTwo = new Model('2x3x2', '../objects/2x3x2.stl', 1.5, 1, 1, 1, 0, 0, 0, 0, 12, 6, 0);
const oneByTwo = new Model('1x2', '../objects/1x2.stl', 3, 1, 1, 1, 0, 0, 0, 0);
const oneByFour = new Model('1x4', '../objects/1x4.stl', 3, 1, 1, 1, 0, 0, 0, 0);
const oneByTwoPin = new Model('1x2 Pin', '../objects/1x2wPin.stl', 3, 1, 1, 1, 1, 0, 0, 0, 0, 5, 0);
const twoByTwoPin = new Model('2x2 Pin', '../objects/2x2wPin.stl', 3, 1, 1, 1, 1, 0, 0, 0, 0, 5, 0);
const twoByTwoByTwoPin = new Model('2x2x2 Pin', '../objects/2x2x2wPin.stl', 3, 1, 1, 1, 1, 0, 0, 0, 0, 5, 0);
const twoByTwoDouble = new Model('2x2 Double', '../objects/2x2Double.stl', 3, 1, 1, 1, 1, 0, 0, 0);
const tire1 = new Model('Tire 1', '../objects/tire1.stl', 1.5, 0, 0, 0, 1, 1, 0, 0);
const tire2 = new Model('Tire 2', '../objects/tire2.stl', 3, 0, 0, 0, 1, 1, 0, 0);
const tire3 = new Model('Tire 3', '../objects/tire3.stl', 3, 0, 0, 0, 1, 1, 0, 0);
const rim1 = new Model('Rim 1', '../objects/rim1.stl', 1.45, 0, 0, 0, 1, 1, 0, 0);
const rim2 = new Model('Rim 2', '../objects/rim2.stl', 3, 0, 0, 0, 0, 1, 0, 0);
const rim3 = new Model('Rim 3', '../objects/rim3.stl', 3, 0, 0, 0, 0, 1, 0, 0);
const oneByTwoPlate = new Model('1x2 Plate', '../objects/1x2P.stl', 3, 1, 1, 1, 0, 0, 0, 0);
const fourBySixPlate = new Model('4x6 Plate', '../objects/4x6P.stl', 3, 1, 1, 1, 0, 0, 0, 0);
const sixByEightPlate = new Model('6x8 Plate', '../objects/6x8P.stl', 3, 1, 1, 1, 0, 0, 0, 0);
const twoByTenPlate = new Model('2x10 Plate', '../objects/2x10P.stl', 3, 1, 1, 1, 0, 0, 0, 0);
const lego_man = new Model('Lego Man', '../objects/lego_man.stl', 3, -1, 0, 1, 0, 0, 0, 0, 0, 0, 0);
const windshield = new Model('Windshield', '../objects/windshield.stl', 3, 1, 1, 1, 0, 0, 0, 0);
const steering = new Model('Steering Wheel', '../objects/steering.stl', 3, 0, 0, 1, 0, 0, 0, 0);

var allModels = [];
allModels.push(lego_man);
allModels.push(oneByOne);
allModels.push(twoByTwo);
allModels.push(oneByTwoPin);
allModels.push(twoByTwoPin);
allModels.push(twoByTwoByTwoPin);
allModels.push(twoByTwoDouble);
allModels.push(tire1);
allModels.push(tire2);
allModels.push(tire3);
allModels.push(rim1);
allModels.push(rim2);
allModels.push(rim3);
allModels.push(twoByThreeByTwo);
allModels.push(oneByTwo);
allModels.push(oneByFour);
allModels.push(oneByTwoPlate);
allModels.push(fourBySixPlate);
allModels.push(sixByEightPlate);
allModels.push(twoByTenPlate);
allModels.push(windshield);
allModels.push(steering);