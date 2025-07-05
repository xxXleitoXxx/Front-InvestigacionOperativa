import "./AtlantisHeader.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navegacion from "./principalPage/Navegacion";

export default function AtlantisHeader() {
  return (
    <header className="header-modern">
      <div className="header-content">
        <div className="header-brand">
          <div className="brand-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7L10 17L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h1 className="brand-title">Modelos de Inventario</h1>
          <p className="brand-subtitle">Sistema de Gestión Inteligente</p>
        </div>
      </div>
      <Navegacion />
    </header>
  );
}
