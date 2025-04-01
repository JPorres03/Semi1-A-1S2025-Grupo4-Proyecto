import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../../models/User';
import { Task } from '../../models/Task';
import { File } from '../../models/File';

dotenv.config();

// Crear conexión a la base de datos
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.
      DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [User,Task,File],
    migrations: [__dirname + '/migrations/*.ts'],
    subscribers: [],
    ssl: {rejectUnauthorized: false}

  });

// Inicializar la conexión
AppDataSource.initialize()
    .then(() => console.log('📦 Base de datos conectada!'))
    .catch((err) => console.error('❌ Error al conectar la base de datos', err));