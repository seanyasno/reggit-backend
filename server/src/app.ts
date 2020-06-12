import {authentication} from './routes';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

// init
app.use(morgan('common'));
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());

// routes
app.use('/api/auth', authentication)

// listen
const PORT = 1337;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});