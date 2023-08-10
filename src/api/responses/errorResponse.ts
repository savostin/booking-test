import { ApiResponse } from "./apiResponse";

const ErrorResponse = (status: number, message: string) => {
    return {
        ...ApiResponse(),
        status,
        message,
    };
}

export { ErrorResponse };