import { Router } from 'express';
import auth from '../middlewares/auth';
import workflowController from '../controllers/workflow.controller';

const router: Router = Router();

router.post('/', auth, workflowController.createWorkflow);

export default router;
