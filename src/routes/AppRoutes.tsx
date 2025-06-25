import { Routes, Route } from "react-router-dom";
import AltaAlumno from "../components/AbmAlumno/AltaAlumno";

import AbmAlumno from "../pages/AbmAlumno";
import PaginaPrincipal from "../pages/Main";
import ProveedorTable from "../components/ProveedorTable/ProveedorTable";
import ArticuloTable from "../components/ArticuloTable/ArticuloTable";
import OrdenCompraTable from "../components/OrdenCompraTable/OrdenCompraTable";
import VentaTable from "../components/VentaTable/VentaTable";

function Aplicacion() {
  return (
    <div>
      <div className="Aplicacion">
        <Routes>
          <Route path="/" element={<PaginaPrincipal />} />
          <Route path="ordenCompra" element={<OrdenCompraTable />} />
          <Route path="altaalumno" element={<AltaAlumno />} />
          <Route path="venta" element={<VentaTable />} />
          <Route path="abmprueba" element={<ProveedorTable />} />
          <Route path="maestroArticulos" element={<ArticuloTable />} />
        </Routes>
      </div>
    </div>
  );
}

export default Aplicacion;
