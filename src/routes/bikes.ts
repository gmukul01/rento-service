import { Router } from 'express';
import { createBike, deleteBike, getAllBikes, rateBike, updateBike } from '../controllers/bikes.controller';
import { addHeaders, verifyAdmin, verifyToken } from '../middleware';

const router = Router();

router.use(addHeaders);
router.put('/', [verifyToken, verifyAdmin], createBike);
router.get('/', [verifyToken], getAllBikes);
router.post('/:bikeId/rate', [verifyToken], rateBike);
router.post('/:bikeId', [verifyToken, verifyAdmin], updateBike);
router.delete('/:bikeId', [verifyToken, verifyAdmin], deleteBike);

export default router;
