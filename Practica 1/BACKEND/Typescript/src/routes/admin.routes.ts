

//ADMIN
import { Router } from 'express';
import { updateBook,createbook, deleteBook, uploadPortada, uploadPdf, updatePortadaController } from '../controller/admin.controller';

const router = Router();

router.put('/books/:id', updateBook);
router.post('/books', uploadPortada,uploadPdf,createbook);
router.delete('/books/:id', deleteBook);
router.post('/books/update_portada/:id', uploadPortada, updatePortadaController);
router.post('/books/update_pdf/:id', uploadPdf, updatePortadaController);


export default router;