import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
//import NavDropdown from "react-bootstrap/NavDropdown";
//Van los Cu, aca se redirige el path
import { useNavigate } from "react-router-dom";
function Navegacion() {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary justify-content-between">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="d-flex w-100 justify-content-between">
              <Nav.Link onClick={() => navigate("/maestroArticulos")}>
                Maestro Articulos
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/ordenCompra")}>
                Orden De Compra
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/venta")}>
                Ventas
                </Nav.Link>
              <Nav.Link onClick={() => navigate("/paginaProps")}>
                PaginaProps
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/abmprueba")}>
                Proveedores
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
export default Navegacion;
