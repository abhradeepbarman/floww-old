import { Router } from 'express';
import auth from '../middlewares/auth';
import connectionController from '../controllers/connection.controller';

const router: Router = Router();

router.post('/:app', auth, connectionController.addConnection);

export default router;
