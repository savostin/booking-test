import { Router } from 'express';
import RouteGroup from 'express-route-grouping';
import { NextFunction, Request, Response } from 'express';
import swaggerUi from "swagger-ui-express";
import { Route } from "tsoa";

import { ErrorResponse } from '../responses';
import { RouteFindRoom } from './findRoom';
import { RouteMakeReservation } from './makeReservation'
import { RouteChangeReservation } from './changeReservation';
import { RouteCancelReservation } from './cancelReservation';


const root = new RouteGroup('/', Router());


root.group(`v${process.env.APP_VERSION_SHORT as string}`, api => {
    api.group('room', req => {
        RouteFindRoom(req);
    })
    api.group('reservation', req => {
        RouteMakeReservation(req);
        RouteChangeReservation(req);
        RouteCancelReservation(req);
    })

    api.get('swagger.json', (req: Request, res: Response, next: NextFunction) => {
        res.sendFile(`v${process.env.APP_VERSION_SHORT}.json`, { root: './src/api/swagger/' });
    })

    api.use(
        "docs",
        swaggerUi.serve,
        swaggerUi.setup(undefined, {
            swaggerOptions: {
                url: `/api/v${process.env.APP_VERSION_SHORT}/swagger.json`,
            },
        })
    );
    api.get('*', (req: Request, res: Response, next: NextFunction) => {
        res.status(404).send(ErrorResponse(404, 'NOT_FOUND'));
    })
});


export default root.export();
