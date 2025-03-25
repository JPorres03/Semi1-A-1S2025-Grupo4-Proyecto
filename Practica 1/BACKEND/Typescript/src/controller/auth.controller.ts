import { Request, Response } from 'express';
import { pool } from "../config/database/Postgres";
import bcrypt from "bcrypt";



export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombres, apellidos, password, email, fecha_nacimiento, rol } = req.body;

        // Validación de los datos requeridos
        if (!nombres || !email || !password || !apellidos || !fecha_nacimiento || !rol) {
            res.status(400).json({ message: 'Faltan datos requeridos (nombre, email, password)' });
            return
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await pool.query(
            `SELECT * FROM Usuarios WHERE Email = $1`,
            [email]
        );
        console.log(usuarioExistente.rows)
        if (usuarioExistente.rows.length > 0) {
            res.status(400).json({ mensaje: "El usuario ya está registrado, Prueba con otro email!" });
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const date = new Date();
        const nuevoUsuario = await pool.query(
            `INSERT INTO Usuarios (Nombres,Apellidos,Email,Password_hash,Foto_perfil_url,Fecha_nacimiento,Rol) VALUES ($1, $2, $3,$4, $5, $6,$7) RETURNING *`,
            [nombres, apellidos, email, hashedPassword, '', fecha_nacimiento, rol]
        );

        res.status(201).json({
            email: nuevoUsuario.rows[0].email,
            rol: nuevoUsuario.rows[0].rol,
            user_id: nuevoUsuario.rows[0].id

        });
        return

    } catch (error: any) {

        res.status(500).send({ message: 'Error al registrar el usuario', error: error.message });
        return
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Faltan datos requeridos (email, password)' });
            return;
        }

        const usuario = await pool.query(`SELECT * FROM Usuarios WHERE Email = $1`, [email]);
        if (usuario.rows.length === 0) {
            res.status(404).json({ mensaje: "Usuario no encontrado", error: true });
            return;
        }


        const esValida = await bcrypt.compare(password, usuario.rows[0].password_hash);
        if (!esValida) {
            res.status(401).json({ mensaje: "Contraseña incorrecta", error: true });
            return
        }
        res.json({ email: usuario.rows[0].email, user_id: usuario.rows[0].id, rol: usuario.rows[0].rol,});
        return
    } catch (error: any) {
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        return
    }
};
