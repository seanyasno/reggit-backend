import {IUserAuth, UserModel, validateUser} from '../models';
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

        UserModel.findOne({
            where: {username}
        }).then(async (userData) => {
            const user: IUserAuth = userData?.toJSON() as IUserAuth;
            const validPass = await bcrypt.compare(password, user.password);

            if (validPass) {
                const token = jwt.sign({
                    username: user.username
                }, process.env.JWT_SECRET || '');
                return response.json({token});
            }

            return response.status(401).json({
                errors: {form: 'Invalid Credentials'}
            });
        }).catch(() => {
            return response.status(401).json({
                errors: {form: 'Invalid Credentials'}
            });
        });
    }
}