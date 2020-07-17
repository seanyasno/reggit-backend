import {PostController} from '../controllers';
import {Router} from 'express';

const router = Router();
const postController = new PostController();

router.get('/', postController.getAllPosts);
router.post('/new', postController.createPost);
router.get('/:id', postController.getPostById);
router.get('/:postId/voteState', postController.getLikeState);
router.put('/:id/:voteState', postController.votePost);
router.delete('/delete/:id', postController.deletePost);

export default router;