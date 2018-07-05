import * as mongoose from 'mongoose';

export default class DatabaseConnector {
  protected db: mongoose.Connection;
  protected gameCollection: mongoose.Collection;
  protected orderCollection: mongoose.Collection;
  protected url: string;
  constructor() {
    this.url = 'mongodb://localhost/local';
    mongoose.connect(this.url)
    this.db = mongoose.connection;

    this.db.on('error', console.error.bind(console, 'connection error:'));
    this.db.once('open', function callback () {
      console.log('Connected to database');
    });

    this.gameCollection = this.db.collection('gameFiles');
    this.orderCollection = this.db.collection('orders');
  }
}