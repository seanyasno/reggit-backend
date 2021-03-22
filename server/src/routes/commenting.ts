import CommentController from '../controllers/comment-controller';
import {Router} from 'express';

const router = Router();
const commentController = new CommentController();

router.post('/new/:postId', commentController.createComment);
router.get('/:postId', commentController.getAllCommentsOfPost);

export default router;