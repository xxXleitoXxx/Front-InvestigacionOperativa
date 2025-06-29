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

  const [tablaModo, setTablaModo] = useState<'todos' | 'faltantes' | 'areponer'>('todos');
  const [isLoadingFiltro, setIsLoadingFiltro] = useState(false);
  const [errorFiltro, setErrorFiltro] = useState<string | null>(null);

  const handleMostrarTodos = () => {
    setTablaModo('todos');
    setErrorFiltro(null);
  };

  const handleMostrarFaltantes = async () => {
    setIsLoadingFiltro(true);
    setErrorFiltro(null);
    try {
      const data = await ArticuloService.getProductosFaltantes();
      setArticulos(data);
      setTablaModo('faltantes');
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
      setTablaModo('areponer');
    } catch (e) {
      setErrorFiltro('Error al cargar artículos a reponer');
    } finally {
      setIsLoadingFiltro(false);
    }
  };

  const [filtroFaltantes, setFiltroFaltantes] = useState(false);
  const [filtroAReponer, setFiltroAReponer] = useState(false);
  const [filtroDadoDeBaja, setFiltroDadoDeBaja] = useState(false);
  const [filtroActivos, setFiltroActivos] = useState(false);

  // Filtrado local
  const articulosFiltrados = articulos.filter((art) => {
    let pasa = true;
    
    // Filtro de artículos activos (no dados de baja)
    if (filtroActivos) {
      pasa = pasa && (!art.fechaHoraBajaArt || art.fechaHoraBajaArt.trim() === "");
    }
    
    // Filtros de stock
    if (filtroFaltantes && filtroAReponer) {
      pasa = pasa && (art.stock === 0 || art.stock < art.stockSeguridad);
    } else if (filtroFaltantes) {
      pasa = pasa && art.stock === 0;
    } else if (filtroAReponer) {
      pasa = pasa && art.stock < art.stockSeguridad;
    }
    
    // Filtro de artículos dados de baja
    if (filtroDadoDeBaja) {
      pasa = pasa && art.fechaHoraBajaArt != null;
    }
    
    return pasa;
  });

  return (
    <div>
      <h1>Tabla Artículos</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Button
          onClick={() =>
            handleClick(
              "Añadir Artículo",
              initializableNewArticulo(),
              ModalType.CREATE
            )
          }
        >
          Nuevo Artículo
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label>
            <input
              type="checkbox"
              checked={filtroActivos}
              onChange={() => setFiltroActivos((v) => !v)}
            />
            Artículos activos
          </label>
          <label>
            <input
              type="checkbox"
              checked={filtroFaltantes}
              onChange={() => setFiltroFaltantes((v) => !v)}
            />
            Artículos faltantes
          </label>
          <label>
            <input
              type="checkbox"
              checked={filtroAReponer}
              onChange={() => setFiltroAReponer((v) => !v)}
            />
            Artículos a reponer
          </label>
          <label>
            <input
              type="checkbox"
              checked={filtroDadoDeBaja}
              onChange={() => setFiltroDadoDeBaja((v) => !v)}
            />
            Artículos dados de baja
          </label>
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Precio Venta</th>
              <th>Descripción</th>
              <th>Stock</th>
              <th>Stock Seguridad</th>
              <th>Demanda Diaria</th>
              <th>Desviación Estándar</th>
              <th>Proveedor</th>
              <th>Proveedores</th>
              <th>Fecha Baja</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {articulosFiltrados.map((art) => (
              <tr key={art.id}>
                <td>{art.id}</td>
                <td>{art.codArt}</td>
                <td>{art.nomArt}</td>
                <td>{art.precioVenta}</td>
                <td>{art.descripcionArt}</td>
                <td>{art.stock}</td>
                <td>{art.stockSeguridad}</td>
                <td>{art.demandaDiaria}</td>
                <td>{art.desviacionEstandar}</td>
                <td>{art.proveedorDTO?.nomProv || "Sin proveedor"}</td>
                <td>
                  <ListButton
                    onClick={() => handleShowProveedores(art)}
                  />
                </td>
                <td>{art.fechaHoraBajaArt || "N/A"}</td>
                <td>
                  <EditButton
                    onClick={() =>
                      handleClick("Editar artículo", art, ModalType.UPDATE)
                    }
                  />
                </td>
                {art.fechaHoraBajaArt == null && (
                  <td>
                    <DeleteButton
                      onClick={() =>
                        handleClick("Borrar Artículo", art, ModalType.DELETE)
                      }
                    />
                  </td>
                )}
                {art.fechaHoraBajaArt != null && (
                  <td>
                    <ButtonAlta
                      onClick={() =>
                        handleClick("Dar de Alta Artículo", art, ModalType.ALTA)
                      }
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
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
