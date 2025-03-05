
import { Request, Response } from 'express';
import { pool } from "../config/database/Postgres";
import bcrypt from "bcrypt";

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
        res.status(200).json(usuario.rows[0]);
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
        res.status(200).json({ message: 'User updated successfully', user: resultado.rows[0] });

        return;
    }
    catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
        return;
    }
};

export const listUserBooks = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const usuario = await pool.query(
            `SELECT * FROM libros WHERE usuario_id = $1`,
            [id]
        );
        if (!usuario.rows[0]) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(usuario.rows);
        return;
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
        return;
    }
};