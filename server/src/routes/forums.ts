import {Router} from 'express';
import ForumController from '../controllers/forum-controller';

const router = Router();
const forumController = new ForumController();

router.get('/getAllForums', forumController.getAllForums);
router.get('/getForumById/:forumId', forumController.getForumById)
router.post('/createForum', forumController.createForum);
router.get('/getPostsOf/:forumId', forumController.getAllPostsByForumId);

export default router;