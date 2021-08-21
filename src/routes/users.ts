import { Router } from 'express';
import { deleteUser, getAllUsers, updateUser } from '../controllers';
import { addHeaders, verifyAdmin, verifyToken } from '../middleware';

const router = Router();

router.use(addHeaders);
router.get('/', [verifyToken, verifyAdmin], getAllUsers);
router.put('/', [verifyToken, verifyAdmin], updateUser);
router.post('/:bookingId', [verifyToken, verifyAdmin], deleteUser);

export default router;
