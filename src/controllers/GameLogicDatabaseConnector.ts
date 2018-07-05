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
  public addOrder(order: object): void {
    this.orderCollection.insert(order);
    //this.gameCollection.update({pin: parseInt(pin)}, {$push: {orders: order}})
  }

  public async getOrders(pin: string): Promise<Array<object>> {
    return await this.orderCollection.find({pin: parseInt(pin)}).toArray();
  }

  public addSupplyOrder(pin: string, orderId: string, order: Array<number>): void {

  }
}