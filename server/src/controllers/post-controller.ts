import {Request, Response} from 'express';
import {IPost, PostModel, UserModel} from '../models';
import IUserDocument from '../models/mongo/user/user-document';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import IPostDocument from '../models/mongo/post/post-document';

export default class PostController {
    async createPost(request: Request, response: Response) {
        const {author, content, votes = 0}: IPost = request.body;

        const post = new PostModel({
            author,
            content,
            votes
        });

        try {
            const savedPost = await post.save();
            return await response.json(savedPost);
        } catch (error) {
            return response.status(400).json({message: error});
        }
    }

    getPostById(request: Request, response: Response) {
        const {id} = request.params;
        PostModel.findOne({_id: id}, async (error: any, res: IPostDocument | null) => {
            if (error || !res) {
                return response.status(401).json({
                    errors: {form: 'Invalid post id'}
                });
            }

            return response.json(res);
        });
    }
}