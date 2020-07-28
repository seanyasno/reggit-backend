import {Request, Response} from 'express';
import {ForumModel, PostModel, ProfileModel, UserModel} from '../models';

export default class ForumController {
    async createForum(request: Request, response: Response) {
        const {name} = request.body;

        try {
            const forum = await ForumModel.create({name});
            response.json(forum);
        } catch (error) {
            response.status(400).json({
                errors: {form: error}
            });
        }
    }

    async getAllForums(request: Request, response: Response) {
        try {
            const forums = await ForumModel.findAll();
            response.json(forums);
        } catch (error) {
            response.status(400).json({
                errors: {form: error}
            });
        }
    }

    async getForumById(request: Request, response: Response) {
        const {forumId} = request.params;

        try {
            const forum = await ForumModel.findOne({where: {id: forumId}});
            response.json(forum);
        } catch (error) {
            response.status(400).json({
                errors: {form: error}
            });
        }
    }

    async getAllPostsByForumId(request: Request, response: Response) {
        const {forumId} = request.params;

        try {
            const forums = await PostModel.findAll({
                include: [
                    {
                        model: ForumModel,
                        where: {
                            id: forumId
                        },
                    },
                    {
                        model: UserModel,
                        attributes: ['username'],
                        include: [ProfileModel]
                    }
                ]
            });
            response.json(forums);
        } catch (error) {
            response.status(400).json({
                errors: {form: error}
            });
        }
    }
}