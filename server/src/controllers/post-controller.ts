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

    async getPostById(request: Request, response: Response) {
        const {id} = request.params;
        try {
            const postData = await PostModel.findOne({where: {id}});
            const post: IPost = await postData?.toJSON() as IPost;
            return response.json(post);
        } catch (error) {
            return response.status(404).json({
                error: {form: 'Invalid post id'}
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
}