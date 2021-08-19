import { Router } from 'express';
import { createBike, rateBike } from '../controllers/bike.controller';
import { addHeaders, verifyAdmin, verifyToken } from '../middleware';

const router = Router();

router.use(addHeaders);
router.put('/', [verifyToken, verifyAdmin], createBike);
router.post('/:bikeId/rate', [verifyToken], rateBike);

export default router;
