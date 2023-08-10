import { ApiResponse } from '../responses/apiResponse';
import { NextFunction, Request, Response, IRouter } from 'express';
import { validationResult } from 'express-validator';

import { authHandler } from '../middlewares/auth';
import { ControllerRooms, roomsFindRequest, roomsFindValidator } from "../controllers/rooms";
import { NotAcceptableError } from '../responses';


const RouteFindRooms = (router: IRouter) => {
    router.get('find', authHandler, roomsFindValidator, async (req: Request, res: Response, next: NextFunction) => {
        const invalid = validationResult(req);
        if (!invalid.isEmpty()) {
            return next(new NotAcceptableError(invalid.array().at(0)?.path)); // TODO more information about the error
        }

        const controller: ControllerRooms = new ControllerRooms();
        const search: roomsFindRequest = {
            from: new Date(req.query.from as string),
            to: new Date(req.query.to as string),
            places: parseInt(req.query.places as string),
            limit: parseInt(req.query.limit as string),
            page: parseInt(req.query.page as string),
            // TODO add order by and desc
            // TODO room and hotel facilities
        }
        return res.send(ApiResponse(await controller.find(search)));

    });

    return router;
};

export default RouteFindRooms;