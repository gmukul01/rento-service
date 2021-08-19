import { Router } from 'express';
import { createBike, deleteBike, rateBike, updateBike } from '../controllers/bike.controller';
import { addHeaders, verifyAdmin, verifyToken } from '../middleware';

const router = Router();

router.use(addHeaders);
router.put('/', [verifyToken, verifyAdmin], createBike);
router.post('/:bikeId/rate', [verifyToken], rateBike);
router.post('/:bikeId', [verifyToken, verifyAdmin], updateBike);
router.delete('/:bikeId', [verifyToken, verifyAdmin], deleteBike);

export default router;
