import {Request, Response} from 'express';
import {CommentModel} from '../models';

export default class CommentController {
    async createComment(request: Request, response: Response) {
        const {postId} = request.params;
        const {userId, content} = request.body;

        try {
            const commentData = await CommentModel.create({
                postId,
                userId,
                content
            });
            const comment = commentData?.toJSON();
            return response.json(comment);
        } catch (error) {
            response.status(400).json({
                errors: {form: error.toString()}
            });
        }
    }

    async getAllCommentsOfPost(request: Request, response: Response) {
        const {postId} = request.params;

        try {
            const comments = await CommentModel.findAll({
                where: {postId}
            });
            return response.json(comments);
        } catch (error) {
            response.status(400).json({
                errors: {form: error.toString()}
            });
        }
    }
}