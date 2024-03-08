// run: node test_server.js
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors()); // This enables CORS for all routes

const port = 8080;


app.get('/api/test1', (req, res) => {
  res.json({ message: 'Response from Test1' });
});

app.post('/api/test2', (req, res) => {
  res.json({ message: 'Response from Test2' });
});

app.listen(port, () => {
    console.log(`Server listening at http://127.0.0.1:${port}`);
});