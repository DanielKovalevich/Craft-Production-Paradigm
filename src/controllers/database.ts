import * as mongoose from 'mongoose';

export default class DatabaseConnector {
  protected db: mongoose.Connection;
  protected gameCollection: mongoose.Collection;
  protected orderCollection: mongoose.Collection;
  protected url: string;
  constructor() {
    if (process.env.NODE_ENV == 'production')
      this.url = 'mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST;
    else 
      this.url = 'mongodb://localhost/local';
    console.log(this.url);
    mongoose.connect(this.url,{useNewUrlParser:true}).catch((e) => {
      console.log(e);
    });
    this.db = mongoose.connection;

    this.db.on('error', console.error.bind(console, 'connection error:'));
    this.db.once('open', function callback () {
      console.log('Connected to database');
    });

    this.gameCollection = this.db.collection('gameFiles');
    this.orderCollection = this.db.collection('orders');
  }
}
