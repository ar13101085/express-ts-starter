import bodyParser from "body-parser";
import express from "express";

import { handleErrors } from "./middleware/error-handler";
import {routes} from "./routes/v1/index";

import * as cors from "cors"

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors.default());

//static file configure
const path: string = (__dirname + '/uploads').split("/dist/src/uploads")[0] + "/uploads";

app.use("/static", express.static(path));
app.get("/", (_req, res) => {
  res.send("API Running");
});
app.use("/api/v1/",routes);

app.use(handleErrors);

export { app };
