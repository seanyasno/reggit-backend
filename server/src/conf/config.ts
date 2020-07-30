import {Sequelize} from 'sequelize';
import localConfig from './local-config.json';

export default class Config {
    private static config: Config;
    private loadLocalConfiguration: boolean = true;

    public static getInstance() {
        if (!this.config) {
            this.config = new Config();
        }

        return this.config;
    }

    public getConfiguration() {
        if (this.loadLocalConfiguration) {
            return localConfig;
        }

        return localConfig;
    }

    public getServerUrl(): string {
        return Config.getInstance().getConfiguration().SERVER_URL + ':' + Config.getInstance().getConfiguration().PORT;
    }
}

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
    database,
    Config
};