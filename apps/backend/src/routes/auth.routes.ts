import { Router } from 'express';
import authController from '../controllers/auth.controller';
import auth from '../middlewares/auth';

const router: Router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', auth, authController.logout);
router.post('/refresh', authController.refresh);

export default router;
