/**
 * This class handles any actual 
 */

import DatabaseConnector from './database';

export class GameLogicDatabaseConnector extends DatabaseConnector {
  constructor() {
    super();
  }

  /**
   * This will add the order to the game object's array
   * @param pinNum 
   * @param order JSON Object that holds all the order details
   */
  public addOrder(pinNum: string, order: object): void {
    this.gameCollection.update({pin: parseInt(pinNum)}, {$push: {orders: order}})
  }

  public async getOrders(pinNum: string): Promise<Array<object>> {
    return await this.gameCollection.findOne({pin: parseInt(pinNum)}, {orders: 1});
  }
}