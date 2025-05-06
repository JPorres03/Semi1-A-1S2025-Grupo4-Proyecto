import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // Ubicación de las entidades generadas; ajusta el path según tu proyecto
  entities: [__dirname + "/../../models/*.ts"],
  synchronize: false, 
  logging: false,
  ssl: {
    rejectUnauthorized: false, // Esto se usa típicamente en entornos de prueba; en producción, conviene configurar los certificados correspondientes
  },
});
