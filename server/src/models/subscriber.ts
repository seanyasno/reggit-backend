import {Model} from 'sequelize';

export default interface ISubscriber extends Model {
    userId: string;
    forumId: string;
}