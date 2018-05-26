'use strict'

/**
 * name: String 
 *  -> Holds the name of the object
 * directory: String 
 *  -> Points to the directory of the model
 * modelBottomAnchor: Boolean 
 *  -> Some models have the center at the bottom
 *  -> It is necessary for calculating placement and positioning
 * top, bottom, front, back, left, right: Boolean
 *  -> Most pieces can only be put together by a few of the surfaces
 */

function Model(name, directory, modelBottomAnchor, top, bottom, front, back, left, right) {
  this.name = name;
  this.directory = directory;
  this.modelBottomAnchor = modelBottomAnchor;
  this.top = top;
  this.bottom = bottom;
  this.front = front;
  this.back = back;
  this.left = left;
  this.right = right;
};

var lego_man = new Model('lego_man', '../objects/lego_man.stl', 1, 0, 1, 0, 0, 0 ,0);
var oneByOne = new Model('oneByOne', '../objects/1x1.stl', 0, 1, 1, 0, 0, 0, 0);
var twoByTwo = new Model('twoByTwo', '../objects/2x2.stl', 0, 1, 1, 0, 0, 0, 0);

var allModels = [lego_man, oneByOne, twoByTwo];