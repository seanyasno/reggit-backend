import {Request, RequestHandler, Response} from "express";
import {UserAuth} from "../models";

export default class LoginController {
    login(request: Request, response: Response) {
        const {identifier, password}: UserAuth = request.body;

        console.log(identifier, password);

        if (identifier === 'admin' && password === 'admin') {
            return response.json({message: 'logged in :D'});
        }

        return response.json({message: 'wrong username or password'});
    }
}