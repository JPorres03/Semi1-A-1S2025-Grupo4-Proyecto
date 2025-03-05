
import { Request, Response } from 'express';
import { pool } from "../config/database/Postgres";
import bcrypt from "bcrypt";

export const getAuthenticatedUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const usuario = await pool.query(
            `SELECT * FROM Usuarios WHERE uuid = $1`,
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
        const { nuevoNombre, nuevaContraseña } = req.body;
        const resultado = await pool.query(
            `UPDATE Usuarios 
             SET nombre = $1, contraseña = $2 
             WHERE uuid = $3 
             RETURNING *`,
            [nuevoNombre, nuevaContraseña, id]
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
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
        return;
    }
};