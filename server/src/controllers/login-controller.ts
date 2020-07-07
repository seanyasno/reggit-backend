import {IUser, ProfileModel, UserModel, validateUser, IUserAuth} from '../models';
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export default class LoginController {
    login(request: Request, response: Response) {
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

        UserModel.findOne({
            where: {username},
            include: [
                {
                    model: ProfileModel,
                    attributes: ['firstName', 'lastName']
                }
            ]
        }).then(async (userData) => {
            const user: IUser = userData?.toJSON() as IUser;
            const validPass = await bcrypt.compare(password, user.password);

            delete user.password;
            console.log(user);

            if (validPass) {
                const token = jwt.sign({...user}, process.env.JWT_SECRET || '');
                return response.json({token});
            }

            return response.status(401).json({
                errors: {form: 'Invalid Credentials'}
            });
        }).catch(error => {
            return response.status(401).json({
                errors: {form: error}
            });
        });
    }
}