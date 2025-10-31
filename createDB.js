const sqlite3 = require('sqlite3').verbose();

// Abrir la base de datos (la crea si no existe)
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Conectado a la base de datos SQLite.');
});

// Crear tabla "libros"
db.run(`
  CREATE TABLE IF NOT EXISTS libros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor TEXT NOT NULL,
    genero TEXT NOT NULL,
    anio INTEGER,
    imagen TEXT
  )
`, (err) => {
  if (err) return console.error(err.message);
  console.log('Tabla "libros" creada o ya existía.');
});

// Cerrar la base de datos
db.close();
