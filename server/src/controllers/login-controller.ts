import {IUser, ProfileModel, UserModel, validateUser, IUserAuth} from '../models';
import {Request, Response} from 'express';
import {ErrorHandler} from '../utils';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import _ from 'lodash';

export default class LoginController {
    async login(request: Request, response: Response) {
        const {username, password}: IUserAuth = request.body;

        const userValidator = validateUser({
            username,
            password
        });

        if (userValidator.error) {
            return response.status(401).json({
                errors: {
                    form: userValidator.error.details[0].message
                }
            });
        }
        let userData;
        try {
            userData = await UserModel.findOne({
                where: {username},
                include: [
                    {
                        model: ProfileModel,
                        attributes: ['firstName', 'lastName']
                    }
                ]
            });

            if (_.isEmpty(userData)) {
                ErrorHandler.handle(response, 'Invalid Credentials', 401);
            }
        } catch (error) {
            return response.status(401).json({
                errors: {form: _.isEmpty(error) ? 'Invalid Credentials' : error}
            });
        }

        const user: IUser = userData?.toJSON() as IUser;
        const validPass = await bcrypt.compare(password, user.password);
        delete user.password;

        if (validPass) {
            const token = jwt.sign({...user}, process.env.JWT_SECRET || '');
            return response.json({token});
        }

        return response.status(401).json({
            errors: {form: 'Invalid Credentials'}
        });
    }
}