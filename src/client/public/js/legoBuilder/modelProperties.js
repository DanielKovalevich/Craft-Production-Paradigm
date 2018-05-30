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

var lego_man = new Model('lego_man', '../objects/lego_man.stl', 3, -1, 0, 1, 0, 0, 0 ,0);
var oneByOne = new Model('oneByOne', '../objects/1x1.stl', 3, 1, 1, 1, 0, 0, 0, 0);
var twoByTwo = new Model('twoByTwo', '../objects/2x2.stl', 3, 1, 1, 1, 0, 0, 0, 0);
var oneByTwoPin = new Model('oneByTwoPin', '../objects/1x2wPin.stl', 3, 1, 1, 1, 1, 0, 0, 0);
var twoByTwoPin = new Model('twoByTwoPin', '../objects/2x2wPin.stl', 3, 1, 1, 1, 1, 0, 0, 0);
var twoByTwoByTwoPin = new Model('twoByTwoByTwoPin', '../objects/2x2x2wPin.stl', 3, 1, 1, 1, 1, 0, 0, 0);
var twoByTwoDouble = new Model('twoByTwoDouble', '../objects/2x2Double.stl', 3, 1, 1, 1, 1, 0, 0, 0);
var tire1 = new Model('tire1', '../objects/tire1.stl', 1.5, 0, 0, 0, 1, 1, 0, 0);
var tire2 = new Model('tire2', '../objects/tire2.stl', 3, 0, 0, 0, 1, 1, 0, 0);4
var tire3 = new Model('tire3', '../objects/tire3.stl', 3, 0, 0, 0, 1, 1, 0, 0);
var rim1 = new Model('rim1', '../objects/rim1.stl', 1.45, 0, 0, 0, 1, 1, 0, 0);
var rim2 = new Model('rim2', '../objects/rim2.stl', 3, 0, 0, 0, 0, 1, 0, 0);
var rim3 = new Model('rim3', '../objects/rim3.stl', 3, 0, 0, 0, 0, 1, 0, 0);
var twoByThreeByTwo = new Model('twoByThreeByTwo', '../objects/2x3x2.stl', 1.5, 1, 1, 1, 0, 0, 0, 0);
var oneByTwo = new Model('oneByTwo', '../objects/1x2.stl', 3, 1, 1, 1, 0, 0, 0, 0);
var oneByFour = new Model('oneByFour', '../objects/1x4.stl', 3, 1, 1, 1, 0, 0, 0, 0);
var oneByTwoPlate = new Model('oneByTwoPlate', '../objects/1x2P.stl', 3, 1, 1, 1, 0, 0, 0, 0);
var fourBySixPlate = new Model('fourBySixPlate', '../objects/4x6P.stl', 3, 1, 1, 1, 0, 0, 0, 0);
var sixByEightPlate = new Model('sixByEightPlate', '../objects/6x8P.stl', 3, 1, 1, 1, 0, 0, 0, 0);
var twoByTenPlate = new Model('twoByTenPlate', '../objects/2x10P.stl', 3, 1, 1, 1, 0, 0, 0, 0);
var windshield = new Model('windshield', '../objects/windshield.stl', 3, 1, 1, 1, 0, 0, 0, 0);
var steering = new Model('steering', '../objects/steering.stl', 3, 0, 0, 1, 0, 0, 0, 0);

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