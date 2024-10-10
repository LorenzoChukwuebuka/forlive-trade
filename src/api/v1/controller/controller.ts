import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import HTTPResponse from '../utils/httpResponse';
import HttpError from '../utils/httpError';

export default abstract class Controller {
    protected HttpResponse = HTTPResponse;

    protected control = (fn: (request: Request) => Promise<any>) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await fn(req);
                const status = req.method === 'POST' ? httpStatus.CREATED : httpStatus.OK;

                // Use HTTPResponse class to send the response
                this.HttpResponse.send(res, status, result, true);
            } catch (error) {
                console.error(error);

                if (error instanceof HttpError) {
                    // Use HTTPResponse class to send the error response
                    return this.HttpResponse.send(res, error.statusCode, {
                        error: error.message,
                        statusCode: error.statusCode
                    }, false);
                }

                // For unexpected errors, use HTTPResponse for internal server errors
                this.HttpResponse.send(res, httpStatus.INTERNAL_SERVER_ERROR, {
                    error: 'An unexpected error occurred',
                    statusCode: httpStatus.INTERNAL_SERVER_ERROR
                }, false);
            }
        };
}
