import RegisterController from '../controllers/register-controller';
import LoginController from '../controllers/login-controller';
import {Router} from 'express';

const router = Router();
const loginController = new LoginController();
const registerController = new RegisterController();

router.post('/login', loginController.login);
router.post('/register', registerController.registerUser);
router.get('/users', registerController.getUsers);

export default router;