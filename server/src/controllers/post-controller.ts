import {IPost, PostModel} from '../models';
import {Request, Response} from 'express';
import {v4} from 'uuid';

export default class PostController {
    async createPost(request: Request, response: Response) {
        const {id = v4(), author, content, votes = 0}: IPost = request.body;

        try {
            const savedPost = await PostModel.create({
                id,
                author,
                content,
                votes
            });
            return await response.json(savedPost);
        } catch (error) {
            return response.status(400).json({message: error});
        }
    }

    getPostById(request: Request, response: Response) {
        const {id} = request.params;
        PostModel.findOne({
            where: {id}
        }).then(async (postData) => {
            const post: IPost = await postData?.toJSON() as IPost;
            return response.json(post);
        }).catch(() => {
            return response.status(404).json({
                errors: {form: 'Invalid post id'}
            });
        })
    }
}