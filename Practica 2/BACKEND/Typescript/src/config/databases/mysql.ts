import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../../models/User';
import { Task } from '../../models/Task';
import { File } from '../../models/File';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'pract2-db.cspigo2o6b5m.us-east-1.rds.amazonaws.com',
    port: 3306,
    username: 'root',
    password: 'Practica2Semi1',
    database: 'taskflowdb',
    synchronize: false, // ✅ ¡Nunca true en producción!
    logging: true, // ✅ Actívalo temporalmente para debug
    entities: [User, Task, File],
    migrations: [__dirname + '/migrations/*.ts'],
    subscribers: [],
    ssl: { rejectUnauthorized: false },
    migrationsRun: false, // ✅ Controla manualmente las migraciones
    extra: {
        connectionLimit: 10, // Opcional para RDS
    }
});

// Inicialización segura con manejo de errores
AppDataSource.initialize()
    .then(() => {
        console.log('📦 Base de datos conectada!');
        // Verifica el estado de las migraciones
        return AppDataSource.showMigrations();
    })
    .catch((err) => {
        console.error('❌ Error al conectar la base de datos', err);
        process.exit(1); // Detiene la aplicación si hay error
    });


/*
MYSQL
hostname: pract2-db.cspigo2o6b5m.us-east-1.rds.amazonaws.com
puerto: 3306
username:root
password:Practica2Semi1
DefaultSchema:taskflowdb
database: taskflowdb
*/ 