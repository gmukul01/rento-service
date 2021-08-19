import { Router } from 'express';
import { signIn, signUp } from '../controllers';
import { addHeaders, checkDuplicateEmail, checkDuplicateUsername, verifyRoleExists } from '../middleware';

const router = Router();

router.use(addHeaders);
router.post('/signup', [checkDuplicateEmail, checkDuplicateUsername, verifyRoleExists], signUp);
router.post('/login', signIn);

export default router;
