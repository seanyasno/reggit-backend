import ISubscriber from '../models/subscriber';
import {Request, Response} from 'express';
import {SubscriberModel} from '../models';
import {ErrorHandler} from '../utils';

export default class SubscriptionController {
    async createSubscriber(request: Request, response: Response) {
        const {forumId, userId}: ISubscriber = request.body;

        try {
            const subscriber = await SubscriberModel.create({
               userId, forumId
            });
            response.json(subscriber);
        } catch (error) {
            ErrorHandler.handle(response, error.toString());
        }
    }

    async removeSubscribe(request: Request, response: Response) {
        const {forumId, userId}: ISubscriber = request.body;

        try {
            const subscriber = await SubscriberModel.destroy({
               where: {userId, forumId}
            });
            return response.json(subscriber);
        } catch (error) {
            return ErrorHandler.handle(response, error.toString());
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
            return response.json(forumIds);
        } catch (error) {
            return ErrorHandler.handle(response, error.toString());
        }
    }

    async getUsersByForumId(request: Request, response: Response) {
        const {forumId} = request.query;

        try {
            if (!forumId) {
                return ErrorHandler.handle(response, 'forum id is missing.');
            }

            const subscribers: Array<ISubscriber> = await SubscriberModel.findAll({
                where: {forumId}
            });
            const userIds: Array<string> = subscribers.map(sub => sub.userId);
            return response.json(userIds);
        } catch (error) {
            return ErrorHandler.handle(response, error.toString());
        }
    }
}