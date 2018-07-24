/* app/server.ts */
require('dotenv').config();
import app from "./models/app";

const port: number = 3000;
app.set('port', port);

app.listen(app.get('port'), () => {
  console.log(`Listening at http://localhost:${port}/`);
});