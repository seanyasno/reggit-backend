import {Router} from 'express';
import CommentController from '../controllers/comment-controller';

const router = Router();
const commentController = new CommentController();

export default router;