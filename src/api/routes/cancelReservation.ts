import { ApiResponse } from '../responses/apiResponse';
import { NextFunction, Request, Response, IRouter } from 'express';
import { validationResult } from 'express-validator';

import { authHandler } from '../middlewares/auth';
import { ControllerReservation, reservationCancelRequest, reservationCancelResponse, reservationCancelValidator } from "../controllers/reservation";
import { ErrorResponse, NotAcceptableError } from '../responses';


const RouteCancelReservation = (router: IRouter) => {
    router.post('cancel', authHandler, reservationCancelValidator, async (req: Request, res: Response, next: NextFunction) => {
        const invalid = validationResult(req);
        if (!invalid.isEmpty()) {
            console.log(invalid.array())
            return next(new NotAcceptableError(invalid.array().at(0)?.path)); // TODO more information about the error
        }

        const controller: ControllerReservation = new ControllerReservation();
        const data: reservationCancelRequest = {
            reservationId: parseInt(req.body.reservationId as string),
            user: res.locals.user
        }
        const reservation: reservationCancelResponse|false = await controller.cancel(data);
        return res.status(422).send(!reservation ? ErrorResponse(422, 'ERROR_CANCELLING_RESERVATION') : ApiResponse(reservation));

    });

    return router;
};

export { RouteCancelReservation };