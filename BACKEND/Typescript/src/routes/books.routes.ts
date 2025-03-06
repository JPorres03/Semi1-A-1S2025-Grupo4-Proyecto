import { Router } from 'express';
import { getBooks, searchBook,detailsBooks,updateBook, adquireBook ,createbook, deleteBook} from '../controller/books.controller';
import { create } from 'domain';

const router = Router();

// Listar todos los libros (con filtros)
router.get('/', getBooks);
router.post('/search',searchBook);
router.get('/:id', detailsBooks);
router.post('/adquire/:id',adquireBook);
//ADMIN
router.put('/admin/:id', updateBook);
router.post('/admin/create/:id', createbook);
router.post('/admin/delete/:id', deleteBook);

export default router;

