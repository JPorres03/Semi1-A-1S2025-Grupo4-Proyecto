
import { Request, Response } from 'express';
import { pool } from "../config/database/Postgres";


export const getAuthenticatedUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const usuario = await pool.query(
            `SELECT * FROM usuarios WHERE id = $1`,
            [id]
        );
        if (!usuario.rows[0]) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({
            user_id: id,
            nombres: usuario.rows[0].nombres,
            apellidos: usuario.rows[0].apellidos,
            email: usuario.rows[0].email,
            foto_perfil: usuario.rows[0].foto_perfil,
            password: usuario.rows[0].password_hash,
            rol: usuario.rows[0].rol,
            fecha_nacimiento: usuario.rows[0].fecha_nacimiento,
        });
        return;
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
        return;
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombres, apellidos,email,fecha_nacimiento,rol } = req.body;

        const resultado = await pool.query(
            `UPDATE Usuarios 
             SET Nombres = $1, Apellidos = $2,Email = $3, Fecha_nacimiento = $4, Rol =$5
             WHERE id = $6
             RETURNING *`,
            [nombres, apellidos,email,fecha_nacimiento,rol,id]
        );
        if (!resultado.rows[0]) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'Usuario actualizado con éxito' });

        return;
    }
    catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
        return;
    }
};

export const listUserBooks = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const userQuery = await pool.query(
            `SELECT id FROM usuarios WHERE id = $1`,
            [id]
        );
        
        if (userQuery.rowCount === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        const adquisicionesQuery = await pool.query(
            `SELECT 
                l.id, 
                l.nombre, 
                l.autor, 
                l.sinopsis, 
                l.portada_url, 
                l.pdf_url, 
                l.anio_publicacion AS publicacion
            FROM adquisiciones a
            JOIN libros l ON a.libro_id = l.id
            WHERE a.usuario_id = $1`,
            [id]
        );

        if (adquisicionesQuery.rowCount === 0) {
            res.status(404).json({ message: 'El usuario no ha adquirido ningún libro!' });
            return
        }
        
        res.status(200).json({
            user_id: id,
            total_books: adquisicionesQuery.rowCount,
            books: adquisicionesQuery.rows
        });
        return;
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
        return
    }
};