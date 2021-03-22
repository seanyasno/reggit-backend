import {Response} from 'express';

export default class ErrorHandler {
    static handle(response: Response, errorMessage: string, status: number = 400) {
        return response.status(status).json({errors: {form: errorMessage}});
    }
}