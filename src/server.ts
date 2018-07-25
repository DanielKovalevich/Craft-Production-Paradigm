/* app/server.ts */
require('dotenv').config();
import app from "./models/app";

const port: number = Number(process.env.PORT) || 3000;
app.set('port', port);

app.listen(app.get('port'), () => {
  console.log(`Listening at http://psu-research-api.heroku.com:${port}/`);
});