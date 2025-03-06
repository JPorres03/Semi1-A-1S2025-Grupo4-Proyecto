
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
            `SELECT * FROM Libros WHERE nombre ILIKE $1`,
            [`%${nombre}%`]
        );
        if (books.rows.length === 0) {
            res.status(404).json({ message: `No books found with the name ${nombre}` });
            return;
        }
        res.status(200).json(books.rows);
        return;
    }catch(error: any){
        res.status(500).json({ message: 'Internal server error', error: error.message });
        return;
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
            res.status(404).json({ message: `Book not found with id: ${id}` });
            return;
        }
        res.status(200).json(book.rows[0]);
        return;
    }catch(error: any){
        res.status(500).json({ message: 'Internal server error', error: error.message });
        return;

    }
}
export const adquireBook = async(req: Request, res: Response) => {
    try {
        const { libro_id } = req.body;
        const { id } = req.params;
        console.log(libro_id, id);
        if (!libro_id || !id) {
            res.status(400).json({ message: 'Faltan datos requeridos (libro_id, usuario_id)' });
            return;
        }
        //verificar si el usuario ya tiene ese libro
        const adquirido = await pool.query(
            `SELECT * FROM Adquisiciones WHERE usuario_id = $1 AND libro_id = $2`,
            [id, libro_id]
        );
        if (adquirido.rows[0]) {
            res.status(400).json({ message: `El usuario ya ha adquirido este libro!` });
            return;
        }
        const adquisicion = await pool.query(
            `INSERT INTO Adquisiciones (usuario_id, libro_id) VALUES ($1, $2) RETURNING *`,
            [id, libro_id]
        );
        if (!adquisicion.rows[0]) {
            res.status(404).json({ message: `Error al adquirir el libro` });
            return;
        }
        res.status(200).json(adquisicion.rows[0]);
        return;
    }catch(error: any){
        res.status(500).json({ message: 'Internal server error', error: error.message });
        return;

    }
};

//solo admin
export const updateBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo, autor, genero, descripcion } = req.body;

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
        res.status(500).json({ message: 'Internal server error', error: error.message });
        return;
    }
};

export const createbook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo, autor, sinopsis, portada_url,pdf_url,anio_publicacion } = req.body;
        const verifyAdmin = await pool.query(
            `SELECT rol FROM Usuarios WHERE id = $1`,
            [id]
        );
        
        const rolUser = verifyAdmin.rows[0]?.rol;
        
        if (rolUser !== 'admin') {
            res.status(403).json({ message: 'Access denied, No eres un admin!' });
            return;
        }

        //verificar si ya existe
        const result = await pool.query(
            `SELECT * FROM Libros WHERE nombre = $1`,
            [titulo]
        );

        if (result.rows[0]) {
            res.status(400).json({ message: 'El libro ya fue creado anteriormente' });
            return;
        }
        const create = await pool.query(
            `INSERT INTO Libros (nombre, autor, sinopsis, portada_url,pdf_url,anio_publicacion) VALUES ($1, $2, $3, $4,$5,$6) RETURNING *`,
            [titulo, autor, sinopsis, portada_url,pdf_url,anio_publicacion]
        );
        if (!create.rows[0]) {
            res.status(404).json({ message: 'Error al crear el libro' });
            return;
        }
        res.status(200).json(create.rows[0]);
        return;
    }catch(error: any){
        res.status(500).json({ message: 'Internal server error', error: error.message });
        return;
    }
};
