import {IUserAuth, UserModel, validateUser} from '../models';
import IUserDocument from '../models/mongo/user/user-document';
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export default class LoginController {
    login(request: Request, response: Response) {
        const {username, password}: IUserAuth = request.body;

        const userValidator = validateUser({
            username,
            password,
        });

        if (userValidator.error) {
            return response.status(401).json({
                errors: {
                    form: userValidator.error.details[0].message
                }
            });
        }

        UserModel.findOne({username}, async (error: any, res: IUserDocument | null) => {
            if (error || !res) {
                return response.status(401).json({
                    errors: {form: 'Invalid Credentials'}
                });
            }

            const validPass = await bcrypt.compare(password, res.password);
            if (validPass) {
                const token = jwt.sign({
                    id: res._id,
                    username: res.username
                }, process.env.JWT_SECRET || '');
                return response.json({token});
            }

            return response.status(401).json({
                errors: {form: 'Invalid Credentials'}
            });
        });
    }
}