// src/app.ts
import express from 'express';
import cors from 'cors'
import { connectPg } from './database/Postgres';
import auth from '../routes/auth.routes';


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

app.use('/auth', auth);



app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});