/* app/server.ts */
import * as express from 'express';
import * as path from 'path';

// Import WelcomeController from controllers entry point
import {WelcomeController} from './routes';
import {DatabaseConnector} from './models/database';

let db: DatabaseConnector = new DatabaseConnector();

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3000;

app.use('/welcome', WelcomeController);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});