import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';


dotenv.config();

// Crear conexión a la base de datos
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false, // Solo para desarrollo (crea tablas automáticamente)
    logging: false,
    entities: [__dirname + '/entities/*.ts'], // Carpeta donde están las entidades
    migrations: [__dirname + '/migrations/*.ts'],
    subscribers: [],
  });

// Inicializar la conexión
AppDataSource.initialize()
    .then(() => console.log('📦 Base de datos conectada!'))
    .catch((err) => console.error('❌ Error al conectar la base de datos', err));