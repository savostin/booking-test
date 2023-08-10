import 'express-async-errors';
import { NextFunction, Request, Response } from 'express';
import Logger from '../../logger';
import { AbstractApiError, ErrorResponse, InternalServerError } from '../responses';

const log = Logger('API');


process.on('unhandledRejection', (reason: Error | any) => {
    log.error(`Unhandled Rejection: ${reason.message || reason}`);
    //throw new InternalServerError(reason.message || reason); // TODO error handling
});

const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
    log.error(error.message);
    if (error instanceof AbstractApiError) {
        error.statusCode ??= 500;
        response.status(error.statusCode).send(ErrorResponse(error.statusCode, error.message));
    }
    response.status(500).send(ErrorResponse(500, "SERVER_ERROR"));
}

export default errorHandler;