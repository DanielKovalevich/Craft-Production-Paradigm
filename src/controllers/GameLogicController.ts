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

  public async getOrders(pin: string): Promise<object> {
    return await this.db.getOrders(pin);
  }
}