/**
 * Controller handles all of the game logic
 * i.e. Things that deal with the orders
 */

import {Request, Response} from 'express';
import {DatabaseConnector} from '../controllers/database';
import Order from '../models/order'

export class GameLogicController {
  private db: DatabaseConnector;
  constructor() {
    this.db = new DatabaseConnector();
  }

  public placeOrder(pinNum: number, modelType: number): void {
    let order = new Order();
    order.setModelType(modelType);
    
  }
}