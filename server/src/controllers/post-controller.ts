import {IPost, PostModel, ProfileModel, UserModel} from '../models';
import {Request, Response} from 'express';
import {v4} from 'uuid';

export default class PostController {
    async createPost(request: Request, response: Response) {
        const {id = v4(), userId, content, votes = 0}: IPost = request.body;

        try {
            const savedPostData = await PostModel.create({
                id,
                userId,
                content,
                votes
            });
            const userData = await UserModel.findOne({
                where: {id: userId},
                attributes: ['id', 'username'],
                include: [
                    {
                        model: ProfileModel,
                        attributes: ['firstName', 'lastName']
                    }
                ]
            });
            let savedPost = savedPostData.toJSON();
            // @ts-ignore
            savedPost['user'] = userData?.toJSON();
            return await response.json(savedPost);
        } catch (error) {
            return response.status(400).json({message: error});
        }
    }

    async getPostById(request: Request, response: Response) {
        const {id} = request.params;
        try {
            const postData = await PostModel.findOne({where: {id}, include: [
                    {
                        model: UserModel,
                        attributes: ['id', 'username'],
                        include: [
                            {
                                model: ProfileModel,
                                attributes: ['firstName', 'lastName']
                            }
                        ]
                    }
                ]});
            let post: IPost = await postData?.toJSON() as IPost;
            return response.json(post);
        } catch (error) {
            return response.status(404).json({
                error: {form: 'Invalid post id'}
            });
        }
    }

    async getAllPosts(request: Request, response: Response) {
        try {
            const posts = await PostModel.findAll({
                include: [
                    {
                        model: UserModel,
                        attributes: ['username'],
                        include: [ProfileModel]
                    }
                ],
            });
            return response.json(posts);
        } catch (error) {
            return response.status(400).json({
                error: {form: error}
            });
        }
    }

    async votePost(request: Request, response: Response) {
        const {id, voteState} = request.params;
        const voteToAdd = voteState === 'true' ? 1 : -1;
        try {
            const postData = await PostModel.increment({votes: voteToAdd}, {where: {id}});
            // @ts-ignore
            const post = postData[0][0][0];
            return response.json({...post});
        } catch (error) {
            return response.status(400).json({
                errors: {form: error}
            });
        }
    }

    async deletePost(request: Request, response: Response) {
        const {id} = request.params;

        try {
            const removedPost = await PostModel.destroy({
                where: {id}
            });
            response.json(removedPost);
        } catch (error) {
            response.status(400).json({
                errors: {form: error}
            });
        }
    }
}