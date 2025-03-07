import { Router } from 'express';
import { getAuthenticatedUser, updateUser, listUserBooks } from '../controller/users.controller';

const router = Router();


//endpoints to users routes
router.get('/profile/:id', getAuthenticatedUser);


router.put('/profile/:id', updateUser);


router.get('/books/:id', listUserBooks);

export default router;