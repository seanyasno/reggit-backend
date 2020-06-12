import {validateUser, UserModel} from '../models';
import UserAuth from '../models/user-auth';
import {Request, Response} from 'express';
import bcrypt from 'bcrypt';

export default class RegisterController {
    async registerUser(request: Request, response: Response) {
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

        console.log('user is valid');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new UserModel({
            username,
            password: hashedPassword
        });

        console.log('user:', user);

        try {
            const savedUser = await user.save();
            console.log('saving user');
            return await response.json(savedUser);
        } catch (error) {
            console.log('there is an error');
            return response.status(400).json({message: error});
        }
    }

    async getUsers(request: Request, response: Response) {
        try {
            const users = await UserModel.find();
            return response.json({users});
        } catch (error) {
            return response.json({errors: error});
        }
    }
}