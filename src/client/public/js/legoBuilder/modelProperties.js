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

function Model(name, directory, scale, yTranslation, top, bottom, front, back, left, right) {
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
};

var lego_man = new Model('lego_man', '../objects/lego_man.stl', 3, -1, 0, 1, 0, 0, 0 ,0);
var oneByOne = new Model('oneByOne', '../objects/1x1.stl', 3, 1, 1, 1, 0, 0, 0, 0);
var twoByTwo = new Model('twoByTwo', '../objects/2x2.stl', 3, 1, 1, 1, 0, 0, 0, 0);
var oneByTwoPin = new Model('oneByTwoPin', '../objects/1x2wPin.stl', 3, 1, 1, 1, 1, 0, 0, 0);
var tire1 = new Model('tire1', '../objects/tire1.stl', 1.5, 0, 0, 0, 1, 1, 0, 0);
var twoByThreeByTwo = new Model('twoByThreeByTwo', '../objects/2x3x2.stl', 1.5, 1, 1, 1, 0, 0, 0, 0);
var oneByTwo = new Model('oneByTwo', '../objects/1x2.stl', 3, 1, 1, 1, 0, 0, 0, 0);
var oneByFour = new Model('oneByFour', '../objects/1x4.stl', 3, 1, 1, 1, 0, 0, 0, 0);

var allModels = [lego_man, oneByOne, twoByTwo];
allModels.push(oneByTwoPin);
allModels.push(tire1);
allModels.push(twoByThreeByTwo);
allModels.push(oneByTwo);
allModels.push(oneByFour);