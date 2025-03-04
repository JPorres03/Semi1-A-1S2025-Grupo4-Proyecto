import { Pool } from "pg";

export const pool = new Pool({
  user: "administrador",
  host: "ebookvault-db.cw1cg86wap20.us-east-1.rds.amazonaws.com",
  database: "ebookvaultSS1",
  password: "Practica1Semi1",
  port: 5432, 
  ssl: { rejectUnauthorized: false }
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