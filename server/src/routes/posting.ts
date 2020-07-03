import {PostController} from '../controllers';
import {Router} from 'express';

const router = Router();
const postController = new PostController();

router.post('/new', postController.createPost);
router.get('/:id', postController.getPostById);

export default router;