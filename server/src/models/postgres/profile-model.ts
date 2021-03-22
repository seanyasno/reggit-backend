import {database} from '../../conf/config';
import {STRING, INTEGER} from 'sequelize';

const ProfileModel = database.define('profile', {
    userId: {
        type: INTEGER,
        field: 'user_id',
        allowNull: false
    },
    firstName: {
        type: STRING,
        field: 'first_name',
        allowNull: false
    },
    lastName: {
        type: STRING,
        field: 'last_name',
        allowNull: false
    }
}, {
    timestamps: false,
    underscored: true
});

export default ProfileModel;