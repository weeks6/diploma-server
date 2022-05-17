import { Router } from 'express';
import { checkSystem, setupSystem } from '../controllers/system.controller';

const router = Router();

router.get('/system', checkSystem);
router.post('/system', setupSystem);

export default router;
