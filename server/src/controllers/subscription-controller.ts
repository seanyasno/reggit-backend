import ISubscriber from '../models/subscriber';
import {Request, Response} from 'express';
import {SubscriberModel} from '../models';

export default class SubscriptionController {
    async createSubscriber(request: Request, response: Response) {
        const {forumId, userId}: ISubscriber = request.body;

        try {
            const subscriber = await SubscriberModel.create({
               userId, forumId
            });
            response.json(subscriber);
        } catch (error) {
            response.status(400).json({
                errors: {form: error.toString()}
            });
        }
    }

    async getForumsByUserId(request: Request, response: Response) {
        const {userId} = request.query;

        try {
            if (!userId) {
                response.status(400).json({
                    errors: {form: 'user id is missing.'}
                });
            }

            const subscribers: Array<ISubscriber> = await SubscriberModel.findAll({
                where: {userId}
            });
            const forumIds: Array<string> = subscribers.map(sub => sub.forumId);
            response.json(forumIds);
        } catch (error) {
            response.status(400).json({
                errors: {form: error.toString()}
            });
        }
    }

    async getUsersByForumId(request: Request, response: Response) {
        const {forumId} = request.query;

        try {
            if (!forumId) {
                response.status(400).json({
                    errors: {form: 'forum id is missing.'}
                });
            }

            const subscribers: Array<ISubscriber> = await SubscriberModel.findAll({
                where: {forumId}
            });
            const userIds: Array<string> = subscribers.map(sub => sub.userId);
            response.json(userIds);
        } catch (error) {
            response.status(400).json({
                errors: {form: error.toString()}
            });
        }
    }
}