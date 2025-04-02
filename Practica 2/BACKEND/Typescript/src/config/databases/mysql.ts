import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../../models/User';
import { Task } from '../../models/Task';
import { File } from '../../models/File';

dotenv.config();

/*
MYSQL
hostname: pract2-db.cspigo2o6b5m.us-east-1.rds.amazonaws.com
puerto: 3306
username:root
password:Practica2Semi1
DefaultSchema:taskflowdb
database: taskflowdb
*/ 

// Crear conexión a la base de datos
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'pract2-db.cspigo2o6b5m.us-east-1.rds.amazonaws.com',
    port: 3306,
    username: 'root',
    password: 'Practica2Semi1',
    database: 'taskflowdb',
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