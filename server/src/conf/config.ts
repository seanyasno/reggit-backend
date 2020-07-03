import {Sequelize} from 'sequelize';

const database = new Sequelize('reggit-local', 'postgres', 'bsgyns0w', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export {
    database
};