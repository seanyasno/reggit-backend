import {database} from '../../conf/config';
import {STRING, INTEGER} from 'sequelize';

const UserModel = database.define('user', {
    username: {
        type: STRING
    },
    password: {
        type: STRING
    }
}, {
    timestamps: false
});

export default UserModel;