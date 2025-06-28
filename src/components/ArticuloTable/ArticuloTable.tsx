import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Loader from "../Loader/Loader";
import { ModalType } from "../../types/ModalType";
import ArticuloModal from "../ArticuloModal/ArticuloModal";
import { EditButton } from "../EditButton/EditButton";
import { DeleteButton } from "../DeleteButton/DeleteButton";
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
      desviacionEstandarUsoPeriodoEntrega: 1, // Inicializado a 1 si debe ser mayor que cero
      desviacionEstandarDurantePeriodoRevisionEntrega: 1, // Inicializado a 1 si debe ser mayor que cero
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

  const [showFaltantes, setShowFaltantes] = useState(false);
  const [showAReponer, setShowAReponer] = useState(false);
  const [faltantes, setFaltantes] = useState<ArticuloDTO[]>([]);
  const [aReponer, setAReponer] = useState<ArticuloDTO[]>([]);
  const [loadingFaltantes, setLoadingFaltantes] = useState(false);
  const [loadingAReponer, setLoadingAReponer] = useState(false);
  const [errorFaltantes, setErrorFaltantes] = useState<string | null>(null);
  const [errorAReponer, setErrorAReponer] = useState<string | null>(null);

  const fetchFaltantes = async () => {
    setLoadingFaltantes(true);
    setErrorFaltantes(null);
    try {
      const data = await ArticuloService.getProductosFaltantes();
      setFaltantes(data);
    } catch (e) {
      setErrorFaltantes('Error al cargar productos faltantes');
    } finally {
      setLoadingFaltantes(false);
    }
  };

  const fetchAReponer = async () => {
    setLoadingAReponer(true);
    setErrorAReponer(null);
    try {
      const data = await ArticuloService.getProductosAReponer();
      setAReponer(data);
    } catch (e) {
      setErrorAReponer('Error al cargar productos a reponer');
    } finally {
      setLoadingAReponer(false);
    }
  };

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
        <Button variant="warning" onClick={() => { setShowFaltantes((v) => !v); if (!showFaltantes) fetchFaltantes(); }}>
          Listado de productos faltantes
        </Button>
        <Button variant="info" onClick={() => { setShowAReponer((v) => !v); if (!showAReponer) fetchAReponer(); }}>
          Listado de productos a reponer
        </Button>
      </div>
      {showFaltantes && (
        <div style={{ marginBottom: '2rem' }}>
          <h4>Productos Faltantes</h4>
          {loadingFaltantes ? <Loader /> : errorFaltantes ? <div>{errorFaltantes}</div> : (
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
                  <th>Desviación Estándar Uso</th>
                  <th>Desviación Estándar Revisión</th>
                  <th>Proveedor</th>
                  <th>Fecha Baja</th>
                  <th>Editar</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {faltantes.map((art) => (
                  <tr key={art.id}>
                    <td>{art.id}</td>
                    <td>{art.codArt}</td>
                    <td>{art.nomArt}</td>
                    <td>{art.precioVenta}</td>
                    <td>{art.descripcionArt}</td>
                    <td>{art.stock}</td>
                    <td>{art.stockSeguridad}</td>
                    <td>{art.demandaDiaria}</td>
                    <td>{art.desviacionEstandarUsoPeriodoEntrega}</td>
                    <td>{art.desviacionEstandarDurantePeriodoRevisionEntrega}</td>
                    <td>{art.proveedorDTO?.nomProv || "Sin proveedor"}</td>
                    <td>{art.fechaHoraBajaArt || "N/A"}</td>
                    <td>
                      <EditButton
                        onClick={() =>
                          handleClick("Editar artículo", art, ModalType.UPDATE)
                        }
                      />
                    </td>
                    <td>
                      <DeleteButton
                        onClick={() =>
                          handleClick("Borrar Artículo", art, ModalType.DELETE)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      )}
      {showAReponer && (
        <div style={{ marginBottom: '2rem' }}>
          <h4>Productos a Reponer</h4>
          {loadingAReponer ? <Loader /> : errorAReponer ? <div>{errorAReponer}</div> : (
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
                  <th>Desviación Estándar Uso</th>
                  <th>Desviación Estándar Revisión</th>
                  <th>Proveedor</th>
                  <th>Fecha Baja</th>
                  <th>Editar</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {aReponer.map((art) => (
                  <tr key={art.id}>
                    <td>{art.id}</td>
                    <td>{art.codArt}</td>
                    <td>{art.nomArt}</td>
                    <td>{art.precioVenta}</td>
                    <td>{art.descripcionArt}</td>
                    <td>{art.stock}</td>
                    <td>{art.stockSeguridad}</td>
                    <td>{art.demandaDiaria}</td>
                    <td>{art.desviacionEstandarUsoPeriodoEntrega}</td>
                    <td>{art.desviacionEstandarDurantePeriodoRevisionEntrega}</td>
                    <td>{art.proveedorDTO?.nomProv || "Sin proveedor"}</td>
                    <td>{art.fechaHoraBajaArt || "N/A"}</td>
                    <td>
                      <EditButton
                        onClick={() =>
                          handleClick("Editar artículo", art, ModalType.UPDATE)
                        }
                      />
                    </td>
                    <td>
                      <DeleteButton
                        onClick={() =>
                          handleClick("Borrar Artículo", art, ModalType.DELETE)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      )}
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
              <th>Desviación Estándar Uso</th>
              <th>Desviación Estándar Revisión</th>
              <th>Proveedor</th>
              <th>Fecha Baja</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {articulos.map((art) => (
              <tr key={art.id}>
                <td>{art.id}</td>
                <td>{art.codArt}</td>
                <td>{art.nomArt}</td>
                <td>{art.precioVenta}</td>
                <td>{art.descripcionArt}</td>
                <td>{art.stock}</td>
                <td>{art.stockSeguridad}</td>
                <td>{art.demandaDiaria}</td>
                <td>{art.desviacionEstandarUsoPeriodoEntrega}</td>
                <td>{art.desviacionEstandarDurantePeriodoRevisionEntrega}</td>
                <td>{art.proveedorDTO?.nomProv || "Sin proveedor"}</td>
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
        />
      )}
    </div>
  );
};

export default ArticuloTable;
