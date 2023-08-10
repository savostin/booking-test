import { NextFunction, Request, Response } from 'express';


const apiHandlerBefore = (request: Request, response: Response, next: NextFunction) => {
    response.set('X-Powered-by', `${process.env.APP_NAME} ${process.env.APP_VERSION}`);
    next();
}


export { apiHandlerBefore };