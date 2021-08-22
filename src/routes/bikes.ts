import { Router } from 'express';
import { createBike, deleteBike, getAllBikes, getAllColors, getAllModels, rateBike, updateBike } from '../controllers/bikes.controller';
import { addHeaders, verifyAdmin, verifyToken } from '../middleware';

const router = Router();

router.use(addHeaders);
router.get('/', getAllBikes);
router.get('/models', getAllModels);
router.get('/colors', getAllColors);
router.put('/', [verifyToken, verifyAdmin], createBike);
router.post('/:bikeId/rate', [verifyToken], rateBike);
router.post('/:bikeId', [verifyToken, verifyAdmin], updateBike);
router.delete('/:bikeId', [verifyToken, verifyAdmin], deleteBike);

export default router;
