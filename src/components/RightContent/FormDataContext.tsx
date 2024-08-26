// server.js
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/api/form', (req, res) => {
  const newData = req.body;

  fs.readFile('data.json', (err, data) => {
    if (err) throw err;
    const json = JSON.parse(data);
    json.push(newData);
    
    fs.writeFile('data.json', JSON.stringify(json, null, 2), err => {
      if (err) throw err;
      res.status(200).send('Datos guardados correctamente');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});