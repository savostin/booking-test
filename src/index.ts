import * as dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import Logger from './logger';
import Router from './api/routes';
import { errorHandler, apiHandlerBefore } from './api/middlewares';
import { InitDemoData } from "./database/init.demo";

import { AppDataSource } from "./database";


const log = Logger();

if (!process.env.WEB_PORT) {
    log.error("Port is not defined");
    process.exit(1);
}

const WEB_PORT: number = parseInt(process.env.WEB_PORT as string, 10);

const app: Application = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(apiHandlerBefore);
app.use(`/api`, Router);
app.use(errorHandler);

/** For testing purpose - delete database each start: */
import fs from "node:fs/promises"
fs.unlink(process.env.DB_DATABASE as string).finally(() => {

    AppDataSource.initialize()
        .then(() => InitDemoData())
        .then(() => {
            app.listen(WEB_PORT, () => {
                log.info(`Listening on port ${WEB_PORT}`);
            })
        })
        .catch((err: Error) => {
            log.error(err);
        })
});

