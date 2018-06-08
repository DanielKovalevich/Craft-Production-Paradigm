/* app/server.ts */
import app from "./models/app";
import {DatabaseConnector} from './models/database';

let db: DatabaseConnector = new DatabaseConnector();
const port: number = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});