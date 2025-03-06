import { Router } from 'express';
import { getAllCategories, getBooksByCategory } from '../controller/categories.controller';

const router = Router();

// Ruta para obtener todas las categorías
router.get('/', getAllCategories);

// Ruta para obtener libros por categoría
router.get('/:id/books', getBooksByCategory);

export default router;