
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
        const { search } = req.params;
        const books = await pool.query(
            `SELECT * FROM Libros WHERE titulo ILIKE $1`,
            [`%${search}%`]
        );
        res.status(200).json(books.rows);
        return;
    }catch(error: any){

    }
};