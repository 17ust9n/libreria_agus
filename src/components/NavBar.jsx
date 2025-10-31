import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/anadir">Añadir Libro</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;
