"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Order {
    constructor(pin) {
        this.pin = pin;
        this._id = this.generateId();
        this.createDate = new Date().getTime();
        this.status = "In Progress";
        this.stage = "Manufacturer";
        this.modelType = 1;
        this.lastModified = this.createDate;
        this.finishedTime = -1;
        this.manufacturerReq = new Array();
        this.supplyOrders = new Array();
        this.assembledModel = {};
        this.colors = new Array();
    }
    setLastModified() {
        this.lastModified = new Date().getTime();
    }
    setFinished() {
        this.finishedTime = new Date().getTime();
    }
    /**
     * This should generally be random enough to handle a couple order ids
     * This isn't a permenant solution; it works well enough for me
     * Found on Github: https://gist.github.com/gordonbrander/2230317
     */
    generateId() {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
    }
    ;
    setStatus(status) {
        this.setLastModified();
        this.status = status;
    }
    setStage(stage) {
        this.setLastModified();
        this.stage = stage;
    }
    setModelType(type) {
        this.setLastModified();
        this.modelType = type;
    }
    // Allows me to easily convert the object and store it into the mongoDB database
    toJSON() {
        let jsonObj = {
            "_id": this._id,
            "pin": this.pin,
            "createDate": this.createDate,
            "lastModified": this.lastModified,
            "finishedTime": this.finishedTime,
            "status": this.status,
            "stage": this.stage,
            "modelType": this.modelType,
            "manufacturerReq": this.manufacturerReq,
            "supplyOrders": this.supplyOrders,
            "colors": this.colors,
            "assembledModel": this.assembledModel
        };
        return jsonObj;
    }
}
exports.default = Order;
