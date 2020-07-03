import {STRING, NUMBER, TEXT, UUID} from 'sequelize';
import {database} from '../../conf/config';

const PostModel = database.define('post', {
    id: {
        type: UUID,
        primaryKey: true
    },
    author: {
        type: STRING
    },
    content: {
        type: TEXT
    },
    votes: {
        type: NUMBER
    }
}, {
    timestamps: false
});

export default PostModel;