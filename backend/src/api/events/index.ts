import express from "express";
import serverless from "serverless-http";
import { router as volunteers} from "./volunteers";
import { router as login} from "./login";
import { router as db_calls} from "./database_events";
import bodyParser from "body-parser";
import compression from "compression";
import morgan from "morgan";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(morgan("combined"));
app.use(compression());
app.use(bodyParser.json());

app.use("/volunteers", volunteers)
app.use("/database", db_calls)
app.use("/login", login)

export const handler = serverless(app)
