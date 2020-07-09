import UserModel from '../models/postgres/user-model';
import {Request, Response} from 'express';
import {ProfileModel} from '../models';

export default class UserController {
    async getAllUsers(request: Request, response: Response) {
        try {
            const users = await UserModel.findAll({
                attributes: ['id', 'username']
            });
            return response.json({users});
        } catch (error) {
            return response.json({errors: error});
        }
    }

    async getProfileByUserId(request: Request, response: Response) {
        try {
            const profile = await ProfileModel.findOne({where: {userId: request.params.id}});
            return response.json(profile);
        } catch (error) {
            return response.json({errors: error});
        }
    }
}