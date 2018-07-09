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
    //TODO: Get rid of this line when I add supplier
    order.setStage('Assembler');
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
}