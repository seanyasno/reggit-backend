import {database} from '../../conf/config';
import ISubscriber from '../subscriber';
import {UUID} from 'sequelize';

const SubscriberModel = database.define<ISubscriber>('subscriber', {
    userId: {
        type: UUID,
        field: 'user_id',
        allowNull: false
    },
    forumId: {
        type: UUID,
        field: 'forum_id',
        allowNull: false
    }
}, {
    timestamps: false
});

export default SubscriberModel;