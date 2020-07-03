import {authentication, posting} from './routes';
import {database} from './conf/config';
import mongoose from 'mongoose';
import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

dotenv.config();
const app = express();

// init
app.use(morgan('common'));
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));
app.use(express.json());

// routes
app.use('/api/auth', authentication)
app.use('/api/post', posting);

// db connection
mongoose.connect(process.env.MONGO_DB_CONNECTION_URL || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => console.log('Connected to mongodb.'));

database.authenticate().then(() => {
    console.log('Connected to postgres database.');
}).catch(error => {
    console.log("Couldn't connect to postgres database.");
    console.error(error);
});

// listen
app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});