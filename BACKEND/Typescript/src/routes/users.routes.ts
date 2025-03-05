import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { getAuthenticatedUser, updateUser, listUserBooks } from '../controller/users.controller';
import { validateToken } from '../middlewares/authMiddleware';
const router = Router();


//endpoints to users routes
router.get('/profile/:id', getAuthenticatedUser);


router.put('/profile/:id', updateUser);


router.get('/books/:id', listUserBooks);

export default router;