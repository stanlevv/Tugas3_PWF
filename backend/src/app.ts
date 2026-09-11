import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';

const app = express();

app.use(cors());
app.use(express.json());

// Test Rute Utama
app.get('/', (req, res) => {
    res.send('Backend Express (TypeScript) Berhasil Berjalan!');
});

app.use('/api', apiRoutes);

export default app;
