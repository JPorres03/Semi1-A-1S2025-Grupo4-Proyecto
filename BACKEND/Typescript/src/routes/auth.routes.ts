import { Router } from 'express';
import  {register, login}  from '../controller/auth.controller';
import { validateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register',  register, validateToken) 
router.post('/login', login)

export default router;