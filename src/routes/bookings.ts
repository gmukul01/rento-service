import { Router } from 'express';
import { createBooking, getAllBookings, getPastBookings, getUpcomingBookings, updateBooking } from '../controllers/bookings.controller';
import { addHeaders, verifyToken } from '../middleware';

const router = Router();

router.use(addHeaders);
router.get('/', [verifyToken], getAllBookings);
router.put('/', [verifyToken], createBooking);
router.post('/:bookingId', [verifyToken], updateBooking);
router.get('/upcoming', [verifyToken], getUpcomingBookings);
router.get('/past', [verifyToken], getPastBookings);

export default router;
