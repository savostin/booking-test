import { ApiResponse } from '../responses/apiResponse';
import { NextFunction, Request, Response, IRouter } from 'express';
import { validationResult } from 'express-validator';

import { authHandler } from '../middlewares/auth';
import { ControllerReservation, reservationChangeRequest, reservationChangeResponse, reservationChangeValidator } from "../controllers/reservation";
import { ErrorResponse, NotAcceptableError } from '../responses';
import { Room } from '../../models/room';


const RouteChangeReservation = (router: IRouter) => {
    router.post('change', authHandler, reservationChangeValidator, async (req: Request, res: Response, next: NextFunction) => {
        const invalid = validationResult(req);
        if (!invalid.isEmpty()) {
            console.log(invalid.array())
            return next(new NotAcceptableError(invalid.array().at(0)?.path)); // TODO more information about the error
        }

        const controller: ControllerReservation = new ControllerReservation();
        const data: reservationChangeRequest = {
            from: new Date(req.body.from as string),
            to: new Date(req.body.to as string),
            places: parseInt(req.body.places as string),
            reservationId: parseInt(req.body.reservationId as string),
        }
        const reservation: reservationChangeResponse|false = await controller.change(data, res.locals.user);
        return res.status(422).send(!reservation ? ErrorResponse(422, 'ERROR_CHANGING_RESERVATION') : ApiResponse(reservation));

    });

    return router;
};

export { RouteChangeReservation };