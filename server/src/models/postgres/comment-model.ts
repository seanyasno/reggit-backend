import {database} from '../../conf/config';
import {TEXT, UUID, UUIDV4} from 'sequelize';

const CommentModel = database.define('comment', {
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
    postId: {
        type: UUID,
        field: 'post_id',
        allowNull: false
    },
    parent: {
        type: UUID,
        field: 'parent',
        allowNull: true
    },
    content: {
        type: TEXT,
        field: 'content',
        allowNull: false
    }
}, {
    timestamps: false
});

export default CommentModel;