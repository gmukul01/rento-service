import { Router } from 'express';
import {
    deleteBooking,
    getAllBookings,
    getPastBookings,
    getUpcomingBookings,
    rentBike,
    updateBooking
} from '../controllers/bookings.controller';
import { addHeaders, verifyToken } from '../middleware';

const router = Router();

router.use(addHeaders);
router.get('/', [verifyToken], getAllBookings);
router.put('/', [verifyToken], rentBike);
router.post('/:bookingId', [verifyToken], updateBooking);
router.delete('/:bookingId', [verifyToken], deleteBooking);
router.get('/upcoming', [verifyToken], getUpcomingBookings);
router.get('/past', [verifyToken], getPastBookings);

export default router;
