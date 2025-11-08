import { Router } from 'express';
import auth from '../middlewares/auth';
import connectionController from '../controllers/connection.controller';

const router: Router = Router();

router.get('/', auth, connectionController.getAllConnections);
router.post('/:app', auth, connectionController.addConnection);
router.post('/:app/url', auth, connectionController.getAuthUrl);
router.get('/:app/callback', connectionController.getConnectionToken);

/**
 * TODO: currently it is just deleting the connection from db, we need to revoke the token also
 */
router.delete('/:app', auth, connectionController.removeConnection);

export default router;
