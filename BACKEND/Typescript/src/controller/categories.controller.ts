import { Request, Response } from 'express';
import { pool } from "../config/database/Postgres";


export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await pool.query(
            `SELECT * FROM Categorias`
        );
        res.status(200).json(categories.rows);
        return;
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
        return;
    }
};


export const getBooksByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        console.log(`Buscando libros para la categoría ID: ${id}`); // Verifica si llega el parámetro

        const books = await pool.query(
            `SELECT l.*, c.Nombre AS Categoria
            FROM Libros l
            INNER JOIN Libros_categorias lc ON l.Id = lc.Libro_id
            INNER JOIN Categorias c ON lc.Categoria_id = c.Id
            WHERE c.Id = $1`,
            [id]
        );

        if (books.rows.length === 0) {
            console.log("No se encontraron libros.");
            res.status(404).json({ message: "No se encontraron libros en esta categoría" });
            return;
        }

        console.log(`Libros encontrados: ${JSON.stringify(books.rows)}`);
        res.status(200).json(books.rows);
    } catch (error: any) {
        console.error("Error en la consulta:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};
