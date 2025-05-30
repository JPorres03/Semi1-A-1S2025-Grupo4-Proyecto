import { Router } from 'express';
import { getBooks, searchBook,detailsBooks, adquireBook} from '../controller/books.controller';


const router = Router();

// Listar todos los libros (con filtros)
router.get('/', getBooks);
router.post('/search',searchBook);
router.get('/:id', detailsBooks);
router.post('/:id/acquire',adquireBook);


export default router;

