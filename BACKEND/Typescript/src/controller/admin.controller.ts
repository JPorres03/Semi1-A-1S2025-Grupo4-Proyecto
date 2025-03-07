

import { Request, Response } from 'express';
import { pool } from "../config/database/Postgres";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { configDotenv } from 'dotenv';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });


configDotenv();
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
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { nombre, autor, sinopsis, anio_publicacion } = req.body;
        const categorias: string[] = req.body.categorias;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const portada = files.portada ? files.portada[0] : null;
        const pdf = files.pdf ? files.pdf[0] : null;
        const bookResult = await pool.query(
            `SELECT * FROM Libros WHERE nombre = $1`,
            [nombre]
        );

        if (bookResult.rows.length > 0) {
            res.status(401).json({ message: "Nombre duplicado", descripcion: 'Este nombre ya está asignado a otro libro' });
            return;
        }

        const categoriasCountResult = await pool.query(
            'SELECT COUNT(DISTINCT id) FROM categorias WHERE id = ANY($1::int[])',
            [categorias]
        );

        if (categoriasCountResult.rows[0].count != categorias.length || categorias.length < 1) {
            res.status(400).json({ error: "Categorías inválidas o duplicadas" });
            return;
        }
        const s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
            }
        });

        // Carga de portada a S3
        let portadaUrl: string | null = null;
        if (portada) {
            const filename = `${uuidv4()}_${portada.originalname}`;
            await s3Client.send(new PutObjectCommand({
                Bucket: process.env.S3_BUCKET!,
                Key: `Fotos/${filename}`,
                Body: portada.buffer,
                ContentType: portada.mimetype
            }));
            portadaUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/Fotos/${filename}`;
        } else {
            res.status(500).json({ error: "No se pudo cargar la portada del libro" });
            return;
        }

        // Carga del libro a S3
        let pdfUrl: string | null = null;
        if (pdf) {
            const filename = `${uuidv4()}_${pdf.originalname}`;
            await s3Client.send(new PutObjectCommand({
                Bucket: process.env.S3_BUCKET!,
                Key: `Libros/${filename}`,
                Body: pdf.buffer,
                ContentType: "application/pdf"
            }));
            pdfUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/Libros/${filename}`;
        } else {
            res.status(500).json({ error: "No se pudo cargar el pdf" });
            return;
        }
        const newBookResult = await pool.query(
            `INSERT INTO libros (nombre, autor, sinopsis, portada_url, pdf_url, anio_publicacion)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, nombre`,
            [nombre, autor, sinopsis, portadaUrl, pdfUrl, anio_publicacion]
        );

        const newBookId = newBookResult.rows[0].id;

        const categoriasData = categorias.map(categoriaId => ({
            libro_id: newBookId,
            categoria_id: categoriaId
        }));

        const insertCategoriasQuery = `
            INSERT INTO libros_categorias (libro_id, categoria_id)
            VALUES ${categoriasData.map(() => '(?, ?)').join(', ')}
        `;

        await pool.query(insertCategoriasQuery, categoriasData.flat());

        await client.query('COMMIT');


        res.status(200).json({ nombre: newBookResult.rows[0].nombre, book_id: newBookId });
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

export const updatePortadaController = async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { id } = req.params;
        const file = req.file;

        const bookResult = await client.query(
            'SELECT * FROM libros WHERE id = $1',
            [id]
        );

        if (bookResult.rows.length === 0) {
            res.status(404).json({ error: "Libro no encontrado" });
            return;
        }

        if (!file) {
            res.status(400).json({ error: "No se pudo actualizar foto portada" });
            return;
        }

        const filename = `${uuidv4()}_${file.originalname}`;

        // Configurar cliente S3
        const s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
            }
        });

        // Subir a S3
        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: `Fotos/${filename}`,
            Body: file.buffer,
            ContentType: file.mimetype
        }));

        const fotoUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/Fotos/${filename}`;

        // Actualizar URL de la portada en la base de datos
        await client.query(
            `UPDATE libros 
             SET portada_url = $1 
             WHERE id = $2`,
            [fotoUrl, id]
        );

        await client.query('COMMIT');

        res.status(200).json({ message: "Actualización exitosa", portada_url: fotoUrl });
    } catch (error: any) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};

export const updatePdfController = async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { id } = req.params;
        const file = req.file;

        const bookResult = await client.query(
            'SELECT * FROM libros WHERE id = $1',
            [id]
        );

        if (bookResult.rows.length === 0) {
            res.status(404).json({ error: "Libro no encontrado" });
            return;
        }

        if (!file) {
            res.status(400).json({ error: "No se pudo actualizar el PDF" });
            return;
        }

        const filename = `${uuidv4()}_${file.originalname}`;

        // Configurar cliente S3
        const s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
            }
        });

        // Subir a S3
        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: `Libros/${filename}`,
            Body: file.buffer,
            ContentType: 'application/pdf'
        }));

        const pdfUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/Libros/${filename}`;

        // Actualizar URL del PDF en la base de datos
        await client.query(
            `UPDATE libros 
             SET pdf_url = $1 
             WHERE id = $2`,
            [pdfUrl, id]
        );

        await client.query('COMMIT');

        res.status(200).json({ message: "Actualización exitosa", pdf_url: pdfUrl });
    } catch (error: any) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};

export const uploadPortada = upload.single('portada');
export const uploadPdf = upload.single('pdf');
