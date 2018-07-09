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
    //this.gameCollection.update({pin: parseInt(pin)}, {$push: {orders: order}})
  }

  public async getOrders(pin: string): Promise<Array<object>> {
    try {
      return await this.orderCollection.find({pin: parseInt(pin)}).toArray();
    } catch(e) {
      return new Array<object>();
    }
  }

  public addSupplyOrder(pin: string, orderId: string, order: Array<number>): void {
    this.orderCollection.update({pin: parseInt(pin), _id: orderId}, {$set: {supplyOrders: order}});
  }

  public async getSupplyOrder(pin: string, orderId: string): Promise<Array<number>> {
    try {
      let orders = await this.orderCollection.findOne({pin: parseInt(pin), _id: orderId}, {fields: {supplyOrders: 1, _id: 0}});
      return orders.supplyOrders;
    } catch(e) {
      return new Array<number>();
    }
  }

  public updatePieces(pin: string, orderId: string, pieces: Array<number>): number {
    if (pieces != null && pieces != undefined) {
      console.log(this.orderCollection.update({pin: parseInt(pin), _id: orderId}, {$set: {supplyOrders: pieces}}));
      return 200;
    }
    return 400;
  }
}