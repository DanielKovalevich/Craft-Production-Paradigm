import * as mongoose from 'mongoose';

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
  public addToDatabase(game: mongoose.Model<any>): void {
    this.gameCollection.insert(game);
  }

  /**
   * Returns whether or not a pin already exists
   * This is to avoid games from having the same pin
   * @param pin Identifier
   */
  public async checkIfPinExists(pinNum: string): Promise<any> {
    let result = await this.gameCollection.findOne({pin: parseInt(pinNum)})
    return result != undefined && result != null;
  }

  /**
   * Increments the active players by one whenever a new player joins the game
   * @param pinNum string
   */
  public addActivePlayer(pinNum: string): void {
    this.gameCollection.update({pin: parseInt(pinNum)}, {$inc: {activePlayers: 1}});
  }

  /**
   * When someone needs to exit the application, this handles removing the active player
   * it will also delete the database entry, if there are no active players
   * @param pinNum string
   */
  public removeActivePlayer(pinNum: string, position: string): void {
    let query = {pin: parseInt(pinNum)};
    let change = {$inc: {activePlayers: -1}, $pull: {positions: position}}
    this.gameCollection.update(query, change);
    this.gameCollection.findOne(query, (err: any, result: any) => {
      if (err) console.log(err);
      if (result.activePlayers <= 0) this.gameCollection.deleteOne(query);
    });
  }

  /**
   * Used for when looking up the game by pin
   * @param pinNum string
   */
  public async getGameObject(pinNum: string): Promise<any> {
    return await this.gameCollection.find({pin: parseInt(pinNum)}).toArray();
  }

  /**
   * Makes sure two users don't end up with the same positions
   * If no positions are returned, the game is full
   * @param pinNum string 
   */
  public async getPossiblePositions(pinNum: string): Promise<any> {
    let possiblePositions: string[] = ['Assembler', 'Supplier', 'Customer'];
    let takenPositions = await this.gameCollection.find({pin: parseInt(pinNum)}, {positions: 1}).toArray();
    takenPositions[0].positions.forEach((element: string) => {
      let index = possiblePositions.indexOf(element);
      if (index != -1) 
        possiblePositions.splice(index, 1);
    });
    return possiblePositions;
  }

  public joinGame(pinNum: string, position: string): void {
    if (position != null && position != "" && position != undefined)
      this.gameCollection.update({pin: parseInt(pinNum)}, {$push: {positions: position}});
  }
}