import { Router } from 'express';
import auth from '../middlewares/auth';
import connectionController from '../controllers/connection.controller';

const router: Router = Router();

router.get('/', auth, connectionController.getAllConnections);
router.get('/:app', auth, connectionController.addConnection);
router.post('/:app/token', auth, connectionController.getConnectionToken);

export default router;
