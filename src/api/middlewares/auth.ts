import { NextFunction, Request, Response } from 'express';
import AuthController from '../controllers/auth';
import { ErrorResponse } from '../responses';
import { User } from '../../models/user';

const authHandler = async (request: Request, response: Response, next: NextFunction) => {
    const apiKey: string | undefined = request.header('X-API-KEY');
    if (apiKey != undefined) {
        const authController = new AuthController();
        const user: User | false = await authController.getUserByKey(apiKey);
        if (user) {
            response.locals.user = user;
            return next();
        }
    }
    response.status(401).send(ErrorResponse(401, "AUTH_FAILED"));
}


export { authHandler };