import {Router} from 'express';
import {PostController} from '../controllers';

const router = Router();
const postController = new PostController();

router.post('/new', postController.createPost);
router.get('/:id', postController.getPostById);

export default router;