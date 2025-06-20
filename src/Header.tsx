import "./AtlantisHeader.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navegacion from "./principalPage/Navegacion";

export default function AtlantisHeader() {
  return (
    <div>
      <div className="d-flex justify-content-between">
        <div className="p-2">
          <h1>Modelos De Inventario</h1>
        </div>
      </div>
      <div>
        <Navegacion />
      </div>
    </div>
  );
}
