import { Router } from 'express';
import { getBooks } from '../controller/books.controller';

const router = Router();

// Listar todos los libros (con filtros)
router.get('/', getBooks);

router.get('/search');
/* 
router.get('/:id', getBookDetails);
router.post('/:id/acquire', acquireBook);
router.get('/:id/read', getBookReadUrl); */

export default router;

