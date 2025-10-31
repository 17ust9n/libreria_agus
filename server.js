const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Carpeta para subir imágenes
const mediaFolder = path.join(__dirname, "media");
if (!fs.existsSync(mediaFolder)) fs.mkdirSync(mediaFolder);

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, mediaFolder),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Conectar a SQLite
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) return console.error(err.message);
  console.log("Conectado a la base de datos SQLite.");
});

// Crear tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS libros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor TEXT NOT NULL,
    genero TEXT NOT NULL,
    anio INTEGER,
    imagen TEXT
  )
`);

// Rutas

// Servir imágenes
app.use("/media", express.static(mediaFolder));

// Obtener todos los libros
app.get("/libros", (req, res) => {
  db.all("SELECT * FROM libros", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Añadir un libro
app.post("/libros", upload.single("imagen"), (req, res) => {
  const { titulo, autor, genero, anio } = req.body;
  const imagen = req.file ? req.file.filename : null;

  db.run(
    "INSERT INTO libros (titulo, autor, genero, anio, imagen) VALUES (?, ?, ?, ?, ?)",
    [titulo, autor, genero, anio, imagen],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
