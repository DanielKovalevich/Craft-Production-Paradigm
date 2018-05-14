/* app/server.ts */
import * as express from 'express';

// Import WelcomeController from controllers entry point
import {WelcomeController} from './routes';

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3000;

app.use('/welcome', WelcomeController);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});
