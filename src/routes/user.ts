import { Router } from 'express';
import { adminBoard, allAccess, userBoard } from '../controllers';
import { addHeaders, verifyAdmin, verifyToken } from '../middleware';

const router = Router();

router.use(addHeaders);
router.get('/all', allAccess);
router.get('/user', [verifyToken], userBoard);
router.get('/admin', [verifyToken, verifyAdmin], adminBoard);

export default router;
