import RegisterController from '../controllers/register-controller';
import LoginController from '../controllers/login-controller';
import {Router} from 'express';
import UserController from '../controllers/user-controller';

const router = Router();
const userController = new UserController();
const loginController = new LoginController();
const registerController = new RegisterController();

router.get('/users', userController.getAllUsers);
router.get('/profile/:id', userController.getProfileByUserId)
router.post('/login', loginController.login);
router.post('/register', registerController.registerUser);

export default router;