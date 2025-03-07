
import { Request, Response } from 'express';
import { pool } from "../config/database/Postgres";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { configDotenv } from 'dotenv';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });


configDotenv();

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


export const updateProfilePhoto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { extra_data } = req.body; // Acceder a otros valores enviados en el body
        const file = req.file;

        
        const userResult = await pool.query(
            'SELECT id FROM usuarios WHERE id = $1',
            [id]
        );

        if (!userResult.rows[0]) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (!file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const filename = `${uuidv4()}_${file.originalname}`;

        const s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
            }
        });

        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: `Fotos/${filename}`,
            Body: file.buffer,
            ContentType: file.mimetype
        }));

        const photoUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/Fotos/${filename}`;

        const updateResult = await pool.query(
            `UPDATE usuarios 
             SET foto_perfil_url = $1 
             WHERE id = $2 
             RETURNING *`,
            [photoUrl, id]
        );

        if (!updateResult.rows[0]) {
            res.status(500).json({ message: 'Failed to update profile photo' });
            return;
        }

        res.status(200).json({ 
            message: 'Profile photo updated successfully',
            photo_url: photoUrl,
            extra_data_received: extra_data // Devolver la clave-valor recibida
        });

    } catch (error: any) {
        res.status(500).json({ 
            message: 'Internal server error', 
            error: error.message 
        });
    }
};

// Middleware para manejar la subida del archivo
export const uploadMiddleware = upload.single('nueva_foto');