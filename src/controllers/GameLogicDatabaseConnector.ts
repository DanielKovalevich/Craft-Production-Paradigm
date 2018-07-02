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
   * @param pin 
   * @param order JSON Object that holds all the order details
   */
  public addOrder(pin: string, order: object): void {
    this.gameCollection.update({pin: parseInt(pin)}, {$push: {orders: order}})
  }

  public async getOrders(pin: string): Promise<Array<object>> {
    try {
      let orders = await this.gameCollection.find({pin: parseInt(pin)}, {fields: {orders: 1, _id: 0}}).next();
      return orders['orders'];
    } catch(e) {
      return new Array<object>();
    }
  }
}