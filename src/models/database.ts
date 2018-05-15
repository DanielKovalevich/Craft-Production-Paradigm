let mongoose = require('mongoose');

export class DatabaseConnector {
  private db: any;
  private url: String;
  constructor() {
    this.url = 'mongodb://localhost/local';
    mongoose.connect(this.url)
    this.db = mongoose.connection;

    this.db.on('error', console.error.bind(console, 'connection error:'));
    this.db.once('open', function callback () {
      console.log('Connected to database!');
    });
  }

  public test() {
    console.log('test');
  }
}