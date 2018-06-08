import * as mongoose from 'mongoose';
import {GameScheme} from './game';

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

  public addToDatabase(game: mongoose.Model<any>) {
    this.gameCollection.insert(game);
  }

  public checkIfPinExists(pin: Number): Boolean {
    this.gameCollection.findOne({"pin": pin}, (err: any, results: any) => {
      return results != null;
    });
    return false;
  }

  public test(): void {
    console.log('test');
  }
}