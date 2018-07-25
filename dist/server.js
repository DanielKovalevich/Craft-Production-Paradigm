"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* app/server.ts */
require('dotenv').config();
const app_1 = require("./models/app");
const port = Number(process.env.PORT) || 3000;
app_1.default.set('port', port);
app_1.default.listen(app_1.default.get('port'), () => {
    console.log(`Listening at http://psu-research-api.heroku.com:${port}/`);
});
