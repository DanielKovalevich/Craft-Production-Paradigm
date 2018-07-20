/**
 * Controller handles all of the game logic
 * i.e. Things that deal with the orders
 */

import {Request, Response} from 'express';
import {GameLogicDatabaseConnector} from '../controllers/GameLogicDatabaseConnector';
import Order from '../models/order'

export class GameLogicController {
  private db: GameLogicDatabaseConnector;
  constructor() {
    this.db = new GameLogicDatabaseConnector();
  }

  public placeOrder(pin: string, modelType: number): void {
    let order = new Order(parseInt(pin));
    order.setModelType(modelType);
    order.setStage('Manufacturer');
    this.db.addOrder(order.toJSON());
  }

  public async getOrders(pin: string): Promise<Array<object>> {
    return await this.db.getOrders(pin);
  }

  public addSupplyOrder(pin: string, orderId: string, order: Array<number>): void {
    this.db.addSupplyOrder(pin, orderId, order);
  }

  public async getSupplyOrder(pin: string, orderId: string): Promise<Array<number>> {
    return await this.db.getSupplyOrder(pin, orderId);
  }

  public updatePieces(pin: string, orderId: string, pieces: Array<number>): number {
    return this.db.updatePieces(pin, orderId, pieces);
  }

  public updateAssembledModel(pin: string, orderId: string, model: object): number {
    return this.db.updateAssembledModel(pin, orderId, model);
  }

  public async getAssembledModel(pin: string, orderId: string): Promise<object> {
    return await this.db.getAssembledModel(pin, orderId);
  }

  public async getManufacturerRequest(pin: string, orderId: string): Promise<Array<number>> {
    return await this.db.getManufacturerRequest(pin, orderId);
  }

  public updateManufacturerRequest(pin: string, orderId: string, request: Array<number>): number {
    return this.db.updateManufacturerRequest(pin, orderId, request);
  }
  
  public rejectOrder(pin: string, orderId: string): number {
    return this.db.rejectOrder(pin, orderId);
  }
}