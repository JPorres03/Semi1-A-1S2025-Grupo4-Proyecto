
import { Request, Response } from 'express';
import { pool } from "../config/database/Postgres";

export const getBooks = async (req: Request, res: Response) => {
    try {
        const books = await pool.query(
            `SELECT * FROM Libros`
        );
        res.status(200).json({
                id: books.rows[0].id,
                nombre: books.rows[0].nombre,
                autor: books.rows[0].autor,
                portada_url: books.rows[0].portada_url
            });
        return;
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
        return;
    }
};


export const searchBook = async (req: Request, res: Response) => {
    try {
        const { nombre } = req.body;
        const books = await pool.query(
            `SELECT * FROM Libros WHERE nombre ILIKE $1`,
            [`%${nombre}%`]
        );
        if (books.rows.length === 0) {
            res.status(404).json({ message: `No books found with the name ${nombre}` });
            return;
        }
        res.status(200).json({
            id: books.rows[0].id,
            nombre: books.rows[0].nombre,
            autor: books.rows[0].autor,
            portada_url: books.rows[0].portada_url
        });
        return;
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
        return;
    }
};

export const detailsBooks = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const bookQuery = await pool.query(
            `SELECT id, nombre, autor, sinopsis, portada_url, pdf_url, anio_publicacion AS anio
            FROM libros WHERE id = $1`,
            [id]
        );
        if (bookQuery.rowCount === 0) {
            res.status(404).json({ error: 'No se encontró ningún libro con ese id' });
            return
        }
        const categoriaQuery = await pool.query(
            `SELECT c.id, c.nombre 
            FROM libros_categorias lc
            JOIN categorias c ON lc.categoria_id = c.id
            WHERE lc.libro_id = $1`,
            [id]
        );
        res.status(200).json({
            ...bookQuery.rows[0],
            categoria: categoriaQuery.rows
        });
        return;
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
        return;

    }
}
export const adquireBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { usuario_id } = req.body;

        const userQuery = await pool.query(
            `SELECT id FROM usuarios WHERE id = $1`,
            [usuario_id]
        );

        if (userQuery.rowCount === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return
        }

        const bookQuery = await pool.query(
            `SELECT id FROM libros WHERE id = $1`,
            [id]
        );

        if (bookQuery.rowCount === 0) {
            res.status(404).json({ error: 'Libro no encontrado' });
            return
        }

        const adquisicionQuery:any = await pool.query(
            `SELECT * FROM adquisiciones WHERE usuario_id = $1 AND libro_id = $2`,
            [usuario_id, id]
        );

        if (adquisicionQuery.rowCount > 0) {
            res.status(400).json({ error: 'El usuario ya adquirió este libro' });
            return
        }

        await pool.query(
            `INSERT INTO adquisiciones (usuario_id, libro_id) VALUES ($1, $2)`,
            [usuario_id, id]
        );

        res.status(200).json({ message: 'Adquisición realizada con éxito' });
        return;
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
        return
    }
};

