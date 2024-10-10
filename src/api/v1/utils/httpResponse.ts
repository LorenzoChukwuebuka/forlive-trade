import { Response } from "express";

export default class HTTPResponse {
    statusCode: number;
    data: object | null;
    message: Response;

    constructor(message: Response, statusCode: number = 200, data: object | null = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }

    static send(message: Response, statusCode: number = 200, data: object | null = null, success:boolean): void {
        const httpResponse = new HTTPResponse(message, statusCode, data);
        message.status(httpResponse.statusCode).json({
            success: success,
            message: httpResponse.statusCode,
            data: httpResponse.data
        });
    }
}
