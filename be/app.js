const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// setting koneksi database
const dbConfig = {
  host: 'db', // sesuai service name di docker-compose
  user: 'root',
  password: 'root',
  database: 'testdb'
};

let db;

// fungsi koneksi dengan retry
function connectWithRetry() {
  db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      console.error('Koneksi ke database gagal, mencoba lagi 5 detik...', err.message);
      setTimeout(connectWithRetry, 5000); // tunggu 5 detik lalu retry
    } else {
      console.log('Terkoneksi ke database');
      startServer();
    }
  });

  db.on('error', (err) => {
    console.error('Database error:', err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connectWithRetry(); // koneksi hilang, coba lagi
    } else {
      throw err; // error lain, stop
    }
  });
}

// endpoint terima data
app.post('/submit', (req, res) => {
  const { name } = req.body;
  db.query('INSERT INTO users (name) VALUES (?)', [name], (err, result) => {
    if (err) {
      console.error('Error insert:', err.message);
      res.status(500).send('Error insert');
      return;
    }
    res.send('Data berhasil dimasukkan');
  });
});

// jalankan server setelah koneksi berhasil
function startServer() {
  app.listen(3020, () => {
    console.log('Backend jalan di port 3020');
  });
}

// mulai koneksi
connectWithRetry();
