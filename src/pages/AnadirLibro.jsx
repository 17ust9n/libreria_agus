import { useState } from "react";

function AnadirLibro() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [genero, setGenero] = useState("");
  const [anio, setAnio] = useState("");
  const [imagen, setImagen] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("autor", autor);
    formData.append("genero", genero);
    formData.append("anio", anio);
    if (imagen) formData.append("imagen", imagen);

    await fetch("http://localhost:5000/libros", {
      method: "POST",
      body: formData
    });

    alert("Libro añadido!");
    setTitulo(""); setAutor(""); setGenero(""); setAnio(""); setImagen(null);
  };

  return (
    <div>
      <h1>Añadir Libro</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required/>
        <input placeholder="Autor" value={autor} onChange={e => setAutor(e.target.value)} required/>
        <input placeholder="Género" value={genero} onChange={e => setGenero(e.target.value)} required/>
        <input type="number" placeholder="Año" value={anio} onChange={e => setAnio(e.target.value)} required/>
        <input type="file" onChange={e => setImagen(e.target.files[0])} />
        <button type="submit">Añadir</button>
      </form>
    </div>
  );
}

export default AnadirLibro;
