import * as mongoose from 'mongoose';
import {GameScheme} from '../models/game';

export class DatabaseConnector {
  private db: any;
  private gameCollection: any;
  private url: string;
  constructor() {
    this.url = 'mongodb://localhost/local';
    mongoose.connect(this.url)
    this.db = mongoose.connection;

    this.db.on('error', console.error.bind(console, 'connection error:'));
    this.db.once('open', function callback () {
      console.log('Connected to database!');
    });

    this.gameCollection = this.db.collection('gameFiles');
  }

  /**
   * This takes the passed in game object and adds it to the database
   * @param game Scheme created earlier
   */
  public addToDatabase(game: mongoose.Model<any>) {
    this.gameCollection.insert(game);
  }

  /**
   * Returns whether or not a pin already exists
   * This is to avoid games from having the same pin
   * @param pin Identifier
   */
  public checkIfPinExists(pinNum: string, callback: Function) {
    this.gameCollection.findOne({pin: parseInt(pinNum)}, (err: any, result: any) => {
      if (err) throw err;
      callback(result != null);
    });
  }

  /**
   * Increments the active players by one whenever a new player joins the game
   * @param pinNum 
   */
  public addActivePlayer(pinNum: string): void {
    this.gameCollection.update({pin: parseInt(pinNum)}, {$inc: {activePlayers: 1}});
  }

  /**
   * When someone needs to exit the application, this handles removing the active player
   * it will also delete the database entry, if there are no active players
   * @param pinNum 
   */
  public removeActivePlayer(pinNum: string): void {
    let query = {pin: parseInt(pinNum)};
    this.gameCollection.update(query, {$inc: {activePlayers: -1}});
    this.gameCollection.findOne(query, (err: any, result: any) => {
      if (result.activePlayers <= 0) this.gameCollection.deleteOne(query);
    });
  }

  /**
   * Used for when looking up the game by pin
   * @param pinNum 
   */
  public async getGameObject(pinNum: string): Promise<any> {
    return await this.gameCollection.find({pin: parseInt(pinNum)}).toArray();
  }
}