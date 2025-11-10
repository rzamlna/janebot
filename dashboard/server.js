import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('✅ Discord HQ Bot Dashboard (mini)'));
app.get('/api/status', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🌐 Dashboard running on http://localhost:${port}`));
