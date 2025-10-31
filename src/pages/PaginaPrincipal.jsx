import { useEffect, useState } from "react";

function PaginaPrincipal() {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/libros") // llamamos a nuestra API
      .then(res => res.json())
      .then(data => setLibros(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Librería Agus</h1>
      <p>Nos dedicamos a ofrecer los mejores libros para todos los gustos.</p>

      <h2>Libros disponibles:</h2>
      <ul>
        {libros.map(libro => (
          <li key={libro.id}>
            <strong>{libro.titulo}</strong> - {libro.autor} ({libro.anio}) - {libro.genero}
            {libro.imagen && <img src={`http://localhost:5000/media/${libro.imagen}`} alt={libro.titulo} width="100"/>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PaginaPrincipal;
