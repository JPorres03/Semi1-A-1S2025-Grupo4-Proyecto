import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { getAuthenticatedUser, updateUser, listUserBooks } from '../controller/users.controller';
import { validateToken } from '../middlewares/authMiddleware';
const router = Router();


//endpoints to users routes
router.get('/profile', validateToken, getAuthenticatedUser);


router.put('/profile', validateToken, updateUser);


router.get('/books/:id', validateToken, listUserBooks);

export default router;