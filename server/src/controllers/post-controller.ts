import {Request, Response} from 'express';

export default class PostController {
    createPost(request: Request, response: Response) {
        response.send('creating post');
    }

    getPostById(request: Request, response: Response) {
        response.send(`getting post by id: ${request.params.id}`);
    }
}