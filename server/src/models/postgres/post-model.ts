import {INTEGER, TEXT, UUID} from 'sequelize';
import {database} from '../../conf/config';

const PostModel = database.define('post', {
    id: {
        type: UUID,
        field: 'id',
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: UUID,
        field: 'user_id',
        allowNull: false
    },
    content: {
        type: TEXT,
        field: 'content',
        allowNull: false
    },
    votes: {
        type: INTEGER,
        field: 'votes',
        allowNull: false
    }
}, {
    timestamps: false,
    underscored: true
});

export default PostModel;