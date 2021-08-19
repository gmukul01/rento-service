import { Router } from 'express';
import { getAllBookings, rentBike } from '../controllers/bookings.controller';
import { addHeaders, verifyToken } from '../middleware';

const router = Router();

router.use(addHeaders);
router.put('/', [verifyToken], rentBike);
router.get('/', [verifyToken], getAllBookings);

export default router;
