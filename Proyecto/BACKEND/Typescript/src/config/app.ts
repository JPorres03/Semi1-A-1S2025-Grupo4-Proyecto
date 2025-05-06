import express from 'express';
import cors from 'cors';
import {AppDataSource } from '../config/database/config'
import { authRouter } from '../routes/User.routes';

const PORT = 3001;
const app = express();

app.use(
    cors({
        origin:'*',
        methods:['GET','POST','PUT','DELETE','PATCH'],
        allowedHeaders: ['Content-Type','Authorization']
    })
)

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use('/auth/', authRouter);

AppDataSource.initialize()
  .then(() => {
    console.log("Conexión exitosa a PostgreSQL con TypeORM");
    // Inicio del servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al inicializar la conexión:", error);
  });