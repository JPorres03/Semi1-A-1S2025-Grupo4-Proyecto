// src/app.ts
import express from 'express';
import cors from 'cors'
import { connectPg } from './database/Postgres';

import auth from '../routes/auth.routes';
import users from '../routes/users.routes';
import books from '../routes/books.routes';
import categories from '../routes/categories.routes';

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
app.use('/users', users);
app.use('/books', books);
app.use('/categories', categories);


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});