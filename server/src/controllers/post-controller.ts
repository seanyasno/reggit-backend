import {CommentModel, ForumModel, IPost, LikeModel, PostModel, ProfileModel, UserModel} from '../models';
import {Request, Response} from 'express';
import {ErrorHandler} from '../utils';
import {v4} from 'uuid';
import _ from 'lodash';

export default class PostController {
    constructor() {
        this.votePost = this.votePost.bind(this);
    }

    async createPost(request: Request, response: Response) {
        const {id = v4(), userId, content, votes = 0, forumId}: IPost = request.body;
        if (_.isEmpty(userId)) {
            return ErrorHandler.handle(response, "Can't create a post with empty user id");
        } else if (_.isEmpty(content)) {
            return ErrorHandler.handle(response, "Can't create a post with empty body");
        } else if (_.isEmpty(forumId)) {
            return ErrorHandler.handle(response, "Can't create a post with empty forum id");
        }

        try {
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
            if (!userData) return ErrorHandler.handle(response, `There is no user with id of ${userId}`);

            const forum = await ForumModel.findOne({where: {id: forumId}});
            if (!forum) return ErrorHandler.handle(response, `There is no forum with id of ${forumId}`);

            const savedPostData = await PostModel.create({
                id,
                userId,
                content,
                votes,
                forumId
            });
            let savedPost = savedPostData.toJSON();
            // @ts-ignore
            savedPost['user'] = userData?.toJSON();
            return response.json(savedPost);
        } catch (error) {
            return ErrorHandler.handle(response, error.toString());
        }
    }

    async getPostById(request: Request, response: Response) {
        const {id} = request.params;
        try {
            const postData = await PostModel.findOne({
                where: {id}, include: [
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
                ]
            });
            let post: IPost = await postData?.toJSON() as IPost;
            return response.json(post);
        } catch (error) {
            return ErrorHandler.handle(response, error.toString());
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
            return ErrorHandler.handle(response, error.toString());
        }
    }

    async votePost(request: Request, response: Response) {
        const {id = '', voteState} = request.params;
        const {user_id = ''} = request.headers;

        if (_.isEmpty(user_id)) return ErrorHandler.handle(response, 'User id is missing.');
        if (_.isEmpty(id)) return ErrorHandler.handle(response, 'Post id is missing.');
        if (voteState !== 'true' && voteState !== 'false') return ErrorHandler.handle(response, 'Vote state is at bad format.');

        const voteToAdd = voteState === 'true' ? 1 : -1;

        try {
            const voteData: any = await LikeModel.findOrCreate({
                where: {postId: id, userId: user_id}
            });
            const vote: any = voteData[0]?.toJSON();
            let post;
            if (Math.abs(vote.state + voteToAdd) > 1) {
                post = await PostController.updateVotes(0, -voteToAdd, id, user_id);
            } else {
                post = await PostController.updateVotes(voteToAdd, vote.state + voteToAdd === 0 ? voteToAdd * 2 : voteToAdd, id, user_id);
            }
            return response.json(post);
        } catch (error) {
            return ErrorHandler.handle(response, error.toString());
        }
    }

    private static async updateVotes(voteState: number, voteToAdd: number, postId: string, userId: string | string[]) {
        await LikeModel.update({state: voteState}, {where: {postId: postId, userId: userId}});
        const postData = await PostModel.increment({votes: voteToAdd}, {where: {id: postId}});
        // @ts-ignore
        let post = postData[0][0][0];
        post = {...post, userId: post.user_id, forumId: post.forum_id};
        delete post.user_id;
        delete post.forum_id;
        return post;
    }

    async deletePost(request: Request, response: Response) {
        const {id} = request.params;

        try {
            await LikeModel.destroy({
                where: {post_id: id}
            });
            await CommentModel.destroy({
                where: {post_id: id}
            });
            const removedPost = await PostModel.destroy({
                where: {id}
            });
            return response.json(removedPost);
        } catch (error) {
            return ErrorHandler.handle(response, error.toString());
        }
    }

    async getLikeState(request: Request, response: Response) {
        const {postId} = request.params;
        const {user_id} = request.headers;

        try {
            const likeModel = await LikeModel.findOne({
                where: {postId, userId: user_id}
            });
            response.json(likeModel);
        } catch (error) {
            return ErrorHandler.handle(response, error.toString());
        }
    }
}