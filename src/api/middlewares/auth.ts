import { NextFunction, Request, Response } from 'express';
import AuthController from '../controllers/auth';
import { ErrorResponse } from '../responses';
import { User } from '../../models/user';

const authHandler = async (request: Request, response: Response, next: NextFunction) => {
    const header: string | undefined = request.header('Authorization');
    if (header) {
        const [, key = undefined] = header?.split(' ') as any;
        if (key != undefined) {
            const authController = new AuthController();
            const user: User | false = await authController.getUserByKey(key);
            if (user) {
                response.locals.user = user;
                return next();
            }
        }
    }
    response.status(401).send(ErrorResponse(401, "AUTH_FAILED"));
}


export { authHandler };