import {INTEGER, TEXT, UUID, UUIDV4} from 'sequelize';
import {database} from '../../conf/config';

const PostModel = database.define('post', {
    id: {
        type: UUID,
        field: 'id',
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4
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
    },
    forumId: {
        type: UUID,
        field: 'forum_id',
        allowNull: false,
        defaultValue: UUIDV4
    }
}, {
    timestamps: false,
    underscored: true
});

export default PostModel;