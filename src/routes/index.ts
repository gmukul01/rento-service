import { Router } from 'express';
import auth from './auth';
import { healthCheck } from './healthCheck';
import user from './user';

const router = Router();

router.get('/healthCheck', healthCheck);
router.use('/auth', auth);
router.use('/test', user);

export default router;
