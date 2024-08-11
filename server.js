const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ecoursemysql', 
  database: 'flashcards_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected...');
});

app.get('/flashcards', (req, res) => {
  const sql = 'SELECT * FROM flashcards';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post('/flashcards', (req, res) => {
  const { question, answer } = req.body;
  const sql = 'INSERT INTO flashcards (question, answer) VALUES (?, ?)';
  db.query(sql, [question, answer], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, question, answer });
  });
});

app.put('/flashcards/:id', (req, res) => {
  const { question, answer } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE flashcards SET question = ?, answer = ? WHERE id = ?';
  db.query(sql, [question, answer, id], (err, result) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

app.delete('/flashcards/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM flashcards WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
