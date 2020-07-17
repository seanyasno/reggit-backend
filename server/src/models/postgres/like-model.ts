import {INTEGER, UUID} from 'sequelize';
import {database} from '../../conf/config';

const LikeModel = database.define('like', {
    postId: {
        type: UUID,
        field: 'post_id',
        allowNull: false
    },
    userId: {
        type: UUID,
        field: 'user_id',
        allowNull: false
    },
    state: {
        type: INTEGER,
        field: 'state',
        allowNull: false,
        defaultValue: 0
    }
}, {
    timestamps: false
});

export default LikeModel;