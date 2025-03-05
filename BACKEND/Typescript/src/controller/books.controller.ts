
import { Request, Response } from 'express';
import { pool } from "../config/database/Postgres";

export const getBooks = async (req: Request, res: Response) => {
    try {
        const books = await pool.query(
            `SELECT * FROM Libros`
        );
        res.status(200).json(books.rows);
        return;
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
        return;
    }
};


export const searchBook = async(req: Request, res: Response) => {
    try {
        const { nombre } = req.body;
        const books = await pool.query(
            `SELECT * FROM Libros WHERE titulo ILIKE $1`,
            [`%${nombre}%`]
        );
        res.status(200).json(books.rows);
        return;
    }catch(error: any){

    }
};

export const detailsBooks = async(req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const book = await pool.query(
            `SELECT * FROM Libros WHERE id = $1`,
            [id]
        );
        if (!book.rows[0]) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.status(200).json(book.rows[0]);
        return;
    }catch(error: any){

    }
}

//solo admin
export const updateBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo, autor, genero, descripcion, nombre } = req.body;

        const result = await pool.query(
            `SELECT rol FROM Usuarios WHERE id = $1`,
            [id]
        );
        
        const rolUser = result.rows[0]?.rol;
        
        if (rolUser !== 'admin') {
            res.status(403).json({ message: 'Access denied' });
            return;
        }

        const resultado = await pool.query(
            `UPDATE Libros 
             SET titulo = $1, autor = $2, genero = $3, descripcion = $4
             WHERE id = $5
             RETURNING *`,
            [titulo, autor, genero, descripcion, id]
        );
        
        if (!resultado.rows[0]) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }


        res.status(200).json({ 
            message: 'Book updated successfully', 
            book: resultado.rows[0]
        });

    }catch(error: any){

    }
};