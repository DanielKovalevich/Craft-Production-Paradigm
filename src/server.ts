/* app/server.ts */
import app from "./models/app";

require('dotenv').config();
const port: number = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});