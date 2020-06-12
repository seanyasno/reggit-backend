import {Request, Response} from 'express';
import {UserAuth, validateUser} from '../models';

export default class LoginController {
    login(request: Request, response: Response) {
        const {username, password}: UserAuth = request.body;

        const userValidator = validateUser({
            username,
            password
        });

        if (userValidator.error) {
            return response.status(400).json({
                errors: {
                    form: userValidator.error.details[0].message
                }
            });
        }

        if (username === 'admin' && password === 'admin') {
            return response.json({message: 'logged in :D'});
        }

        return response.json({message: 'wrong username or password'});
    }
}