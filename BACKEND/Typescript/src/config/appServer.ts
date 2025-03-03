// src/app.ts
import express from 'express';
import cors from 'cors'
import { connectPg } from './database/Postgres';


const PORT =  3001;
const app = express();

app.use(
  cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'] 
  })
)

connectPg();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});