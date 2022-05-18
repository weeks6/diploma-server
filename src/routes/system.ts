import { Router } from 'express';
import { checkSystem, setupSystem } from '../controllers/system.controller';

const router = Router();

router.get('/', checkSystem);
router.post('/', setupSystem);

export default router;
