import { Router } from 'express';
import auth from './auth';
import bike from './bikes';
import booking from './bookings';
import { healthCheck } from './healthCheck';
import user from './users';

const router = Router();

router.get('/healthCheck', healthCheck);
router.use('/auth', auth);
router.use('/bikes', bike);
router.use('/bookings', booking);
router.use('/test', user);

export default router;
