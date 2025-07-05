import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
//import NavDropdown from "react-bootstrap/NavDropdown";
//Van los Cu, aca se redirige el path
import { useNavigate, useLocation } from "react-router-dom";

function Navegacion() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/maestroArticulos", label: "Maestro Artículos", icon: "📦" },
    { path: "/ordenCompra", label: "Orden de Compra", icon: "🛒" },
    { path: "/venta", label: "Ventas", icon: "💰" },
    { path: "/abmprueba", label: "Proveedores", icon: "🏢" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navigation-modern">
      <Container>
        <Nav className="nav-modern">
          {navItems.map((item) => (
            <Nav.Link
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-item-modern ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Nav.Link>
          ))}
        </Nav>
      </Container>
    </nav>
  );
}

export default Navegacion;
