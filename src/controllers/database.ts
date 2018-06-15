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

  public getConnection(): any {
    return this.db;
  }

  // TODO: Delete once I test this
  public addOneNewEntry(): void {
    let test = {
      pin: 0,
      groupName: "test",
      status: "waiting",
      maxPlayers: 2,
      activePlayers: 1,
      positions: ["Crafter", "Distributer"]
    }

    let Game = mongoose.model('Game', GameScheme);
    let game = new Game(test);
    this.gameCollection.insert(game);
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
  public checkIfPinExists(pin: Number): Boolean {
    this.gameCollection.findOne({"pin": pin}, (err: any, results: any) => {
      return results != null;
    });
    return false;
  }

  public getGameObject(pinNum: string, callback: Function): any {
    this.gameCollection.find({pin: parseInt(pinNum)}).toArray(function(err: any, result: any) {
      if (err) throw err;
      callback(result[0]);
    });
  }
}