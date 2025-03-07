

import { Request, Response } from 'express';
import { pool } from "../config/database/Postgres";

export const updateBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, autor, sinopsis, anio_publicacion } = req.body;

        const bookQuery = await pool.query(
            `SELECT id FROM libros WHERE id = $1`,
            [id]
        );

        if (bookQuery.rowCount === 0) {
            res.status(404).json({ error: 'Libro no encontrado' });
            return;
        }

        await pool.query(
            `UPDATE libros SET 
                nombre = COALESCE($1, nombre),
                autor = COALESCE($2, autor),
                sinopsis = COALESCE($3, sinopsis),
                anio_publicacion = COALESCE($4, anio_publicacion)
            WHERE id = $5`,
            [nombre, autor, sinopsis, anio_publicacion, id]
        );

        res.status(200).json({ message: 'Libro actualizado con éxito' });
        return;
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
        return;
    }
};

export const createbook = async (req: Request, res: Response) => {
    try {
        const { nombre, autor, sinopsis, portada_url, pdf_url, anio_publicacion,categorias } = req.body;

        const result = await pool.query(
            `SELECT * FROM Libros WHERE nombre = $1`,
            [nombre]
        );

        if (result.rows[0]) {
            res.status(400).json({ message: 'El libro ya fue creado anteriormente' });
            return;
        }

        const categoriasQuery = await pool.query(
            `SELECT COUNT(id) FROM categorias WHERE id = ANY($1)`,
            [categorias]
        );

        if (categoriasQuery.rows[0].count != categorias.length || categorias.length < 1) {
            res.status(400).json({ error: 'Categorías inválidas o duplicadas' });
            return;
        }
        const create = await pool.query(
            `INSERT INTO Libros (nombre, autor, sinopsis, portada_url,pdf_url,anio_publicacion) VALUES ($1, $2, $3, $4,$5,$6) RETURNING *`,
            [nombre, autor, sinopsis, portada_url, pdf_url, anio_publicacion]
        );
        if (!create.rows[0]) {
            res.status(404).json({ message: 'Error al crear el libro' });
            return;
        }

        const newBook = create.rows[0];

        const categoriasData = categorias.map((categoria_id: number) => [newBook.id, categoria_id]);
        await pool.query(
            `INSERT INTO libros_categorias (libro_id, categoria_id) VALUES ${categoriasData.map(() => '(?, ?)').join(', ')}`,
            categoriasData.flat()
        );
        res.status(200).json({ nombre: newBook.nombre, book_id: newBook.id });
        return;
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
        return;
    }
};

export const deleteBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const bookQuery = await pool.query(
            `SELECT id FROM libros WHERE id = $1`,
            [id]
        );

        if (bookQuery.rowCount === 0) {
            res.status(404).json({ error: 'Libro no encontrado' });
            return;
        }

        await pool.query(`DELETE FROM adquisiciones WHERE libro_id = $1`, [id]);
        await pool.query(`DELETE FROM libros_categorias WHERE libro_id = $1`, [id]);
        await pool.query(`DELETE FROM libros WHERE id = $1`, [id]);

        res.status(200).json({ message: 'Libro eliminado exitosamente' });
        return;
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        return;
    }
};
