import { ApiResponse } from '../responses/apiResponse';
import { NextFunction, Request, Response, IRouter } from 'express';
import { validationResult } from 'express-validator';

import { authHandler } from '../middlewares/auth';
import { ControllerReservation, reservationMakeRequest, reservationMakeResponse, reservationMakeValidator } from "../controllers/reservation";
import { ErrorResponse, NotAcceptableError } from '../responses';
import { Room } from '../../models/room';


const RouteMakeReservation = (router: IRouter) => {
    router.put('make', authHandler, reservationMakeValidator, async (req: Request, res: Response, next: NextFunction) => {
        const invalid = validationResult(req);
        if (!invalid.isEmpty()) {
            console.log(invalid.array())
            return next(new NotAcceptableError(invalid.array().at(0)?.path)); // TODO more information about the error
        }

        const controller: ControllerReservation = new ControllerReservation();
        const data: reservationMakeRequest = {
            from: new Date(req.body.from as string),
            to: new Date(req.body.to as string),
            places: parseInt(req.body.places as string),
            roomId: parseInt(req.body.roomId as string),
        }
        const room: reservationMakeResponse|false = await controller.make(data, res.locals.user);
        return res.status(422).send(!room ? ErrorResponse(422, 'ERROR_CREATING_RESERVATION') : ApiResponse(room));

    });

    return router;
};

export { RouteMakeReservation };