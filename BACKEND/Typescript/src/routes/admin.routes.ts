

//ADMIN
import { Router } from 'express';
import { updateBook,createbook, deleteBook } from '../controller/admin.controller';

const router = Router();

router.put('/books/:id', updateBook);
router.post('/books', createbook);
router.delete('/books/:id', deleteBook);


export default router;