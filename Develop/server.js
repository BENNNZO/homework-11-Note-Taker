const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/notes.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/notes.html'));
});

app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));

  newNote.id = notes.length++;
  notes.push(newNote);

  fs.writeFileSync('./db/db.json', JSON.stringify(notes));

  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  const updatedNotes = notes.filter((note) => note.id !== parseInt(req.params.id));

  fs.writeFileSync('./db/db.json', JSON.stringify(updatedNotes));

  res.json({message: 'Note deleted!'});
});

// Start the server
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));