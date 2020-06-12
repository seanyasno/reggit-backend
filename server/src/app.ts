import express, {Request, Response} from 'express';
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
app.get('/ping', (req: Request, res: Response) => {
    res.send('pong');
});

// middlewares

// listen
const PORT = 1337;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});