/* app/server.ts */
import app from "./models/app";

const port: number = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});