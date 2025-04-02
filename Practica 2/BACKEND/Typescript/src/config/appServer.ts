import express from 'express';
import cors from 'cors'
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { AppDataSource } from '../config/databases/mysql';
import { authRouter } from '../routes/auth.routes';
import { taskRouter } from '../routes/task.routes';
import { filesRouter } from '../routes/files.routes';

dotenv.config();


const PORT = 3001;
const app = express();

app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
)


app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.get('/version', (req, res) => {
    res.status(200).json({ version: '1.0.0' });
});

//Rutas

app.use('/api/auth',authRouter);

app.use('/api/task', taskRouter)

app.use('/api/files', filesRouter)

//inicializamos el proyecto con appdatasourec
AppDataSource.initialize().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
});