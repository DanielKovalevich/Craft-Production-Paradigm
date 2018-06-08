/* app/server.ts */
import * as express from 'express';

import {WelcomeController, StartGameController} from './routes';
import {DatabaseConnector} from './models/database';

let db: DatabaseConnector = new DatabaseConnector();

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3000;

app.use('/welcome', WelcomeController);
app.use('/startGame', StartGameController);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});