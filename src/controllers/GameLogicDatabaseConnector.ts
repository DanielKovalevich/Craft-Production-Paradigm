/**
 * This class handles any actual 
 */

import DatabaseConnector from './database';

export class GameLogicDatabaseConnector extends DatabaseConnector {
  constructor() {
    super();
  }

  public addOrder(pinNum: string, order: object): void {
    this.gameCollection.update({pin: parseInt(pinNum)}, {$push: {orders: order}})
  }
}