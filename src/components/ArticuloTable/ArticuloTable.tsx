import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Loader from "../Loader/Loader";
import { ModalType } from "../../types/ModalType";
import ArticuloModal from "../ArticuloModal/ArticuloModal";
import ProveedoresArticuloModal from "../ArticuloModal/ProveedoresArticuloModal";
import { EditButton } from "../EditButton/EditButton";
import { DeleteButton } from "../DeleteButton/DeleteButton";
import { ListButton } from "../ListButton/ListButton";
import type { ArticuloDTO } from "../../types/ArticuloDTO";
import { ArticuloService } from "../../services/ArticuloSevice";
import { ButtonAlta } from "../ButtonAlta/ButtonAlta";
import "./ArticuloTable.css";

const ArticuloTable = () => {
  // Constante para inicializar un artículo por defecto y evitar el undefined
  const initializableNewArticulo = (): ArticuloDTO => {
    return {
      id: 0,
      codArt: "",
      nomArt: "",
      precioVenta: 0,
      descripcionArt: "",
      fechaHoraBajaArt: "",
      stock: 0,
      stockSeguridad: 0,
      demandaDiaria: 1, // Inicializado a 1 si debe ser mayor que cero
      desviacionEstandar: 1, // Inicializado a 1 si debe ser mayor que cero
      proveedorDTO: null, // Inicializado como null si es opcional
    };
  };

  const [articulo, setArticulo] = useState<ArticuloDTO>(
    initializableNewArticulo()
  );
  // Constantes para manejar el estado del modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [title, setTitle] = useState("");

  // Estado para el modal de proveedores del artículo
  const [showProveedoresModal, setShowProveedoresModal] = useState(false);
  const [selectedArticulo, setSelectedArticulo] = useState<ArticuloDTO | null>(null);

  // Lógica del Modal
  const handleClick = (
    newTitle: string,
    art: ArticuloDTO,
    modal: ModalType
  ) => {
    setTitle(newTitle);
    setModalType(modal);
    setArticulo(art);
    setShowModal(true);
  };

  // Función para mostrar proveedores del artículo
  const handleShowProveedores = (articulo: ArticuloDTO) => {
    setSelectedArticulo(articulo);
    setShowProveedoresModal(true);
  };

  // Variable que va a contener los datos recibidos de la API
  const [articulos, setArticulos] = useState<ArticuloDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);

  // Este hook se va a ejecutar cada vez que se renderice el componente o refreshData cambie de estado
  useEffect(() => {
    const fetchArticulos = async () => {
      const articulosData = await ArticuloService.getArticulos();
      setArticulos(articulosData);
      setIsLoading(false);
    };
    fetchArticulos();
  }, [refreshData]);

  // Estado para el filtro activo (solo uno a la vez)
  const [filtroActivo, setFiltroActivo] = useState<'todos' | 'faltantes' | 'areponer' | 'activos' | 'dadosDeBaja'>('todos');
  const [isLoadingFiltro, setIsLoadingFiltro] = useState(false);
  const [errorFiltro, setErrorFiltro] = useState<string | null>(null);

  const handleMostrarTodos = async () => {
    setIsLoadingFiltro(true);
    setErrorFiltro(null);
    try {
      const data = await ArticuloService.getArticulos();
      setArticulos(data);
      setFiltroActivo('todos');
    } catch (e) {
      setErrorFiltro('Error al cargar todos los artículos');
    } finally {
      setIsLoadingFiltro(false);
    }
  };

  const handleMostrarFaltantes = async () => {
    setIsLoadingFiltro(true);
    setErrorFiltro(null);
    try {
      const data = await ArticuloService.getProductosFaltantes();
      setArticulos(data);
      setFiltroActivo('faltantes');
    } catch (e) {
      setErrorFiltro('Error al cargar artículos faltantes');
    } finally {
      setIsLoadingFiltro(false);
    }
  };

  const handleMostrarAReponer = async () => {
    setIsLoadingFiltro(true);
    setErrorFiltro(null);
    try {
      const data = await ArticuloService.getProductosAReponer();
      setArticulos(data);
      setFiltroActivo('areponer');
    } catch (e) {
      setErrorFiltro('Error al cargar artículos a reponer');
    } finally {
      setIsLoadingFiltro(false);
    }
  };

  const handleMostrarActivos = () => {
    setFiltroActivo('activos');
    setErrorFiltro(null);
  };

  const handleMostrarDadosDeBaja = () => {
    setFiltroActivo('dadosDeBaja');
    setErrorFiltro(null);
  };

  // Filtrado local
  const articulosFiltrados = articulos.filter((art) => {
    switch (filtroActivo) {
      case 'activos':
        return !art.fechaHoraBajaArt || art.fechaHoraBajaArt.trim() === "";
      case 'dadosDeBaja':
        return art.fechaHoraBajaArt && art.fechaHoraBajaArt.trim() !== "";
      case 'faltantes':
      case 'areponer':
        // Para estos filtros, los datos ya vienen filtrados del backend
        return true;
      default:
        return true; // 'todos'
    }
  });

  return (
    <div className="articulo-table-container">
      <div className="page-header">
        <div className="page-title">
          <h1>📦 Gestión de Artículos</h1>
          <p className="page-subtitle">Administra tu inventario de manera eficiente</p>
        </div>
        <Button
          className="btn btn-primary btn-add"
          onClick={() =>
            handleClick(
              "Añadir Artículo",
              initializableNewArticulo(),
              ModalType.CREATE
            )
          }
        >
          <span className="btn-icon">+</span>
          Nuevo Artículo
        </Button>
      </div>

      <div className="filters-section">
        <div className="filters-container">
          <Button
            className={`filter-btn ${filtroActivo === 'todos' ? 'active' : ''}`}
            variant={filtroActivo === 'todos' ? 'primary' : 'outline-primary'}
            onClick={handleMostrarTodos}
            disabled={isLoadingFiltro}
          >
            📋 Todos
          </Button>
          <Button
            className={`filter-btn ${filtroActivo === 'activos' ? 'active' : ''}`}
            variant={filtroActivo === 'activos' ? 'primary' : 'outline-primary'}
            onClick={handleMostrarActivos}
          >
            ✅ Activos
          </Button>
          <Button
            className={`filter-btn ${filtroActivo === 'dadosDeBaja' ? 'active' : ''}`}
            variant={filtroActivo === 'dadosDeBaja' ? 'primary' : 'outline-primary'}
            onClick={handleMostrarDadosDeBaja}
          >
            🗑️ Dados de Baja
          </Button>
          <Button
            className={`filter-btn ${filtroActivo === 'faltantes' ? 'active' : ''}`}
            variant={filtroActivo === 'faltantes' ? 'primary' : 'outline-primary'}
            onClick={handleMostrarFaltantes}
            disabled={isLoadingFiltro}
          >
            ⚠️ Faltantes
          </Button>
          <Button
            className={`filter-btn ${filtroActivo === 'areponer' ? 'active' : ''}`}
            variant={filtroActivo === 'areponer' ? 'primary' : 'outline-primary'}
            onClick={handleMostrarAReponer}
            disabled={isLoadingFiltro}
          >
            🔄 A Reponer
          </Button>
        </div>
      </div>

      {errorFiltro && (
        <div className="alert alert-danger" role="alert">
          {errorFiltro}
        </div>
      )}

      {isLoading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <div className="table-container">
          <Table className="table-modern" striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Stock Seg.</th>
                <th>Proveedor</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {articulosFiltrados.map((art) => (
                <tr key={art.id} className="table-row-modern">
                  <td className="text-center">{art.id}</td>
                  <td className="text-center">
                    <span className="code-badge">{art.codArt}</span>
                  </td>
                  <td>
                    <div className="product-info">
                      <div className="product-name">{art.nomArt}</div>
                      <div className="product-description">{art.descripcionArt}</div>
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="price-badge">${art.precioVenta}</span>
                  </td>
                  <td className="text-center">
                    <span className={`stock-badge ${art.stock < art.stockSeguridad ? 'low' : 'normal'}`}>
                      {art.stock}
                    </span>
                  </td>
                  <td className="text-center">{art.stockSeguridad}</td>
                  <td className="text-center">
                    <span className="provider-badge">
                      {art.proveedorDTO?.nomProv || "Sin proveedor"}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className={`status-badge ${art.fechaHoraBajaArt ? 'inactive' : 'active'}`}>
                      {art.fechaHoraBajaArt ? 'Inactivo' : 'Activo'}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="action-buttons">
                      <ListButton
                        onClick={() => handleShowProveedores(art)}
                      />
                      <EditButton
                        onClick={() =>
                          handleClick("Editar artículo", art, ModalType.UPDATE)
                        }
                      />
                      <DeleteButton
                        onClick={() =>
                          handleClick("Borrar Artículo", art, ModalType.DELETE)
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {showModal && (
        <ArticuloModal
          show={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          art={articulo}
          title={title}
          refreshData={setRefreshData}
          proveedorPredeterminado={articulo.proveedorDTO?.nomProv}
        />
      )}
      {showProveedoresModal && selectedArticulo !== null && (
        <ProveedoresArticuloModal
          show={showProveedoresModal}
          onHide={() => setShowProveedoresModal(false)}
          articulo={selectedArticulo}
        />
      )}
    </div>
  );
};

export default ArticuloTable;
