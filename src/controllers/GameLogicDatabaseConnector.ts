/**
 * This class handles any actual game logic
 */

import DatabaseConnector from './database';

export class GameLogicDatabaseConnector extends DatabaseConnector {
  constructor() {
    super();
  }

  /**
   * This will add the order to the game object's array
   * @param pin 
   * @param order JSON Object that holds all the order details
   */
  public addOrder(order: object): void {
    this.orderCollection.insert(order);
  }

  /**
   * Gets all of the orders that are part of the same session
   * @param pin 
   */
  public async getOrders(pin: string): Promise<Array<object>> {
    try {
      return await this.orderCollection.find({pin: parseInt(pin)}).toArray();
    } catch(e) {
      return new Array<object>();
    }
  }

  // This happens at the supplier stage
  // I don't know why I have two functions that essentially do the same thing (idgaf at this point)
  // fixed: they no longer do the same thing
  public addSupplyOrder(pin: string, orderId: string, order: Array<number>, colors: Array<string>): void {
    let time: number = new Date().getTime();
    let update: Object = {$set: {supplyOrders: order, colors: colors, lastModified: time, stage: 'Assembler'}};
    this.orderCollection.update({pin: parseInt(pin), _id: orderId}, update);
  }

  public async getSupplyOrder(pin: string, orderId: string): Promise<Array<number>> {
    try {
      let orders = await this.orderCollection.findOne({pin: parseInt(pin), _id: orderId}, {fields: {supplyOrders: 1, _id: 0}});
      return orders.supplyOrders;
    } catch(e) {
      return new Array<number>();
    }
  }

  public async getColors(pin: string, orderId: string): Promise<Array<any>> {
    try {
      let query = {pin: parseInt(pin), _id: orderId};
      let fields = {fields: {colors: 1, _id: 0}}
      let result = await this.orderCollection.findOne(query, fields);
      if (await result == null) return await result;
      return await result.colors;
    } catch(e) {
      console.log(e);
      return new Array<any>();
    }
  }

  // this is used in the assembler stage
  public updatePieces(pin: string, orderId: string, pieces: Array<number>): number {
    if (pieces != null && pieces != undefined) {
      let time: number = new Date().getTime();
      let update: Object = {$set: {supplyOrders: pieces, lastModified: time}};
      this.orderCollection.update({pin: parseInt(pin), _id: orderId}, update);
      return 200;
    }
    return 400;
  }

  /**
   * Updates the assembled model in the database
   * Also assumed that the process has been finishes so status is changed
   * and time completed is recorded
   * @param pin 
   * @param orderId 
   * @param model 
   */
  public updateAssembledModel(pin: string, orderId: string, model: object): number {
    if (model != null && model != undefined) {
      let time: number = new Date().getTime();
      let update: Object = {$set: {assembledModel: model, status: 'Completed', finishedTime: time, stage: 'Inspection'}};
      this.orderCollection.update({pin: parseInt(pin), _id: orderId}, update);
      return 200;
    }
    return 400;
  }
  
  public async getAssembledModel(pin: string, orderId: string): Promise<object> {
    try {
      let query: Object = {pin: parseInt(pin), _id: orderId.toString()};
      let projection: Object = {fields: {assembledModel: 1, _id: 0}}
      return await this.orderCollection.findOne(query, projection);
    } catch(e) {
      console.log(e);
      return new Object();
    }
  }

  public async getManufacturerRequest(pin: string, orderId: string): Promise<Array<number>> {
    try {
      let request = await this.orderCollection.findOne({pin: parseInt(pin), _id: orderId}, {fields: {manufacturerReq: 1, _id: 0}});
      return request.manufacturerReq;
    } catch(e) {
      return new Array<number>();
    }
  }
  
  /**
   * Once the manufacturer request is sent, the time modified is updated and the game goes to the supplier stage
   * @param pin 
   * @param orderId 
   * @param request 
   */
  public updateManufacturerRequest(pin: string, orderId: string, request: Array<number>): number {
    if (request != null && request != undefined) {
      let time: number = new Date().getTime();
      let update: Object = {$set: {manufacturerReq: request, stage: 'Supplier', lastModified: time}};
      this.orderCollection.update({pin: parseInt(pin), _id: orderId}, update);
      return 200;
    }
    return 400;
  }

  /**
   * If the user doesn't approve the model, the game will turn back to the supplier stage
   * @param pin 
   * @param orderId 
   */
  public rejectOrder(pin: string, orderId: string): number {
    try {
      let time: number = new Date().getTime();
      let update: Object = {$set: {status: 'In Progress', stage: 'Supplier', lastModified: time, assembledModel: null, finishedTime: -1}};
      this.orderCollection.update({pin: parseInt(pin), _id: orderId}, update);
      return 200;
    } catch(e) {
      return 400;
    }
  }
}