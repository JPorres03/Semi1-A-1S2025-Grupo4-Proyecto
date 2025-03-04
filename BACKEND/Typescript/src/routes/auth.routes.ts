import { Router } from 'express';
import  {register, login}  from '../controller/auth.controller';
import { verificarToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register',[ register, verificarToken]) 
router.post('/login', login)



export default router;