import { AbstractApiError } from "./abstractError";

export class NotFoundError extends AbstractApiError {
    constructor(message: string) {
        super(message, 404);
    }
};