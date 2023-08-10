import { AbstractApiError } from "./abstractError";

export class NotAcceptableError extends AbstractApiError {
    constructor(message: string) {
        super(`Input validation error: ${message}`, 400);
    }
};