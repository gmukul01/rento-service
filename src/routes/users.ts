import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, updateUser } from '../controllers';
import { addHeaders, verifyAdmin, verifyToken } from '../middleware';

const router = Router();

router.use(addHeaders);
router.get('/', [verifyToken, verifyAdmin], getAllUsers);
router.put('/', [verifyToken, verifyAdmin], createUser);
router.post('/:userId', [verifyToken, verifyAdmin], updateUser);
router.delete('/:userId', [verifyToken, verifyAdmin], deleteUser);

export default router;
