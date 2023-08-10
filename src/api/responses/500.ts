import { AbstractApiError } from "./abstractError";

export class InternalServerError extends AbstractApiError {
    constructor(message: string) {
        super(message, 500);
    }

};