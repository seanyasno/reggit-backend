import UserModel from '../models/postgres/user-model';
import {Request, Response} from 'express';
import {validateUser,  IUserAuth} from '../models';
import bcrypt from 'bcrypt';
import {v4} from 'uuid';

export default class RegisterController {
    async registerUser(request: Request, response: Response) {
        const {username, password}: IUserAuth = request.body;

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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            const savedUser = await UserModel.create({
                id: v4(),
                username,
                password: hashedPassword
            });
            return await response.json(savedUser);
        } catch (error) {
            return response.status(400).json({message: error});
        }
    }
}