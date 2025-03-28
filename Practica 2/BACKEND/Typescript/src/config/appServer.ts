import express from 'express';
import cors from 'cors'

const PORT = 3001;
const app = express();

app.use(
    cors({
        origin: '*', 
        methods: ['GET', 'POST', 'PUT', 'DELETE'], 
        allowedHeaders: ['Content-Type', 'Authorization'] 
    })
)


app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
  
app.get('/version', (req, res) => {
res.status(200).json({ version: '1.0.0' });
});

//Rutas



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});