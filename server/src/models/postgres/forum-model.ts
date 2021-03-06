import {UUID, UUIDV4, STRING} from 'sequelize';
import {database} from '../../conf/config';

const ForumModel = database.define('forum', {
    id: {
        type: UUID,
        field: 'id',
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING,
        field: 'name',
        allowNull: false
    },
    description: {
        type: STRING,
        field: 'description',
        allowNull: true
    }
}, {
    timestamps: false
});

export default ForumModel;