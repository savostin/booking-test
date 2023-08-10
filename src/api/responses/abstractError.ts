export class AbstractApiError extends Error
{
    statusCode: number;
    constructor(message: string, statusCode: number = 500) {
        super(message);
        Object.setPrototypeOf(this, AbstractApiError.prototype);
        this.statusCode = statusCode;
      }

};
