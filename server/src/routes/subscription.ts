import {Router} from 'express';
import SubscriptionController from '../controllers/subscription-controller';

const router = Router();
const subscriptionController = new SubscriptionController();

router.post('/new', subscriptionController.createSubscriber);
router.get('/getForums', subscriptionController.getForumsByUserId);
router.get('/getUsers', subscriptionController.getUsersByForumId);

export default router;