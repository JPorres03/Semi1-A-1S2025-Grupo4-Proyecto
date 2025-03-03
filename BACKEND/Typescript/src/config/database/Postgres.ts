import { Pool } from "pg";

const pool = new Pool({
  user: "Administrador",
  host: "ebookvault-db.cw1cg86wap20.us-east-1.rds.amazonaws.com",
  database: "ebookvault-db",
  password: "Practica1Semi1",
  port: 5432, 
});

export const connectPg= async() =>{
  try {
    const client = await pool.connect();
    const res = await client.query("SELECT NOW()");
    console.log("Conectado a PostgreSQL:", res.rows);
    client.release();
  } catch (err) {
    console.error("Error de conexión:", err);
  }
}