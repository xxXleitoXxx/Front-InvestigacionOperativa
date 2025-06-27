import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Loader from "../Loader/Loader";
import { ModalType } from "../../types/ModalType";
import { EditButton } from "../EditButton/EditButton";
import { DeleteButton } from "../DeleteButton/DeleteButton";
import type { OrdenCompraDTO } from "../../types/OrdenCompraDTO";
import { OrdenCompraService } from "../../services/OrdenCompraService";
import OrdenCompraModal from "../OrdenCompraModal/OrdenCompraModal";
import { toast } from "react-toastify";

const OrdenCompraTable = () => {
  // Constante para inicializar un artículo por defecto y evitar el undefined
  const initializableNewOrdenCompra = (): OrdenCompraDTO => {
    return {
      id: 0,
      montoTotal: 0,
      fechaPedidoOrdCom: "",
      fechaLlegadaOrdCom: "",
      articuloDTO: { id: 0, nomArt: "" },
      estadoOrdenCompraDTO: { id: 0, nomEOC: "" },
      cantPedida: 0,
      proveedorDTO: { id: 0, nomProv: "" }
    };
  };

  // Constantes para manejar el estado del modal
  const [OrdenCompra, setOrdenCompra] = useState<OrdenCompraDTO>(
    initializableNewOrdenCompra()
  );
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [title, setTitle] = useState("");

  // Lógica del Modal
  const handleClick = async (
    newTitle: string,
    OC: OrdenCompraDTO,
    modal: ModalType
  ) => {
    // Si es edición, verificar el estado de la orden
    if (modal === ModalType.UPDATE) {
      try {
        setIsLoading(true);
        
        // Determinar qué función del servicio llamar basándose en el estado
        switch (OC.estadoOrdenCompraDTO?.id) {
          case 1: // Estado inicial/pendiente → cambiar a estado 2
            console.log('Orden en estado pendiente - cambiando a estado 2');
            await handleOrdenPendiente(OC);
            setRefreshData(prev => !prev);
            setIsLoading(false);
            return;
          case 2: // Estado en proceso → cambiar a estado 3
            console.log('Orden en proceso - cambiando a estado 3');
            await handleOrdenEnProceso(OC);
            setRefreshData(prev => !prev);
            setIsLoading(false);
            return;
          case 3: // Estado finalizada - no se puede editar
            console.log('Orden finalizada - no se puede editar');
            toast.warning('No se puede editar una orden finalizada');
            setIsLoading(false);
            return;
          case 4: // Estado cancelada - no se puede editar
            console.log('Orden cancelada - no se puede editar');
            toast.warning('No se puede editar una orden cancelada');
            setIsLoading(false);
            return;
          default:
            console.log('Estado no reconocido - usando updateOrdenCompra por defecto');
        }
      } catch (error) {
        console.error('Error al procesar la orden:', error);
        toast.error('Error al procesar la orden');
        setIsLoading(false);
        return;
      } finally {
        setIsLoading(false);
      }
    }
    
    setTitle(newTitle);
    setModalType(modal);
    setOrdenCompra(OC);
    setShowModal(true);
  };

  const clickBotton = async () => {
    try {
      setIsLoading(true);
      console.log('Iniciando generación de pedidos...');
      await OrdenCompraService.crearOCPedidoFijo();
      toast.success('Pedidos generados con éxito');
      console.log('Orden de compra creada con éxito');
      // Refrescar los datos después de generar los pedidos
      setRefreshData(prev => !prev);
    } catch (error) {
      console.error('Error al crear la orden de compra:', error);
      toast.error(
        `Error al generar pedidos: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancelarOrden = async (ordenCompra: OrdenCompraDTO) => {
    try {
      setIsLoading(true);
      // Actualizar el estado de la orden a cancelada (id: 4)
      const ordenCancelada = {
        ...ordenCompra,
        estadoOrdenCompraDTO: { id: 4, nomEOC: "Cancelada" }
      };
      await OrdenCompraService.cancelarOrdenCompra(ordenCancelada);
      toast.success('Orden de compra cancelada con éxito');
      setRefreshData(prev => !prev);
    } catch (error) {
      console.error('Error al cancelar la orden de compra:', error);
      toast.error(
        `Error al cancelar la orden: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar órdenes en estado pendiente (1 → 2)
  const handleOrdenPendiente = async (ordenCompra: OrdenCompraDTO) => {
    try {
      // Cambiar estado de 1 (pendiente) a 2 (en proceso)
      const ordenActualizada = {
        ...ordenCompra,
        estadoOrdenCompraDTO: { id: 2, nomEOC: "En Proceso" }
      };
      await OrdenCompraService.updateOrdenCompra(ordenCompra.id, ordenActualizada);
      toast.success('Orden actualizada a estado "En Proceso"');
    } catch (error) {
      console.error('Error al actualizar orden pendiente:', error);
      throw error;
    }
  };

  // Función para manejar órdenes en proceso (2 → 3)
  const handleOrdenEnProceso = async (ordenCompra: OrdenCompraDTO) => {
    try {
      // Cambiar estado de 2 (en proceso) a 3 (finalizada)
      const ordenFinalizada = {
        ...ordenCompra,
        estadoOrdenCompraDTO: { id: 3, nomEOC: "Finalizada" }
      };
      await OrdenCompraService.finalizarOrdenCompra(ordenFinalizada);
      toast.success('Orden finalizada con éxito');
    } catch (error) {
      console.error('Error al finalizar orden en proceso:', error);
      throw error;
    }
  };

  // Función para manejar órdenes finalizadas (ya no se pueden editar)
  const handleOrdenFinalizada = async (ordenCompra: OrdenCompraDTO) => {
    try {
      toast.warning('No se puede editar una orden finalizada');
      throw new Error('Orden finalizada no editable');
    } catch (error) {
      console.error('Error al intentar editar orden finalizada:', error);
      throw error;
    }
  };

  // Variable que va a contener los datos recibidos de la API
  const [ordencompras, setOrdenCompras] = useState<OrdenCompraDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);

  // Este hook se va a ejecutar cada vez que se renderice el componente o refreshData cambie de estado
  useEffect(() => {
    const fetchOrdenCompra = async () => {
      const ordencompraData = await OrdenCompraService.getOrdenCompra();
      setOrdenCompras(ordencompraData);
      setIsLoading(false);
    };
    fetchOrdenCompra();
  }, [refreshData]);

  return (
    <div>
      <h1>Tabla Orden de Compra</h1>
       <Button
        onClick={() =>
          handleClick(
            "Realizar Orden de Compra",
            initializableNewOrdenCompra(),
            ModalType.CREATE
          )
        }
      >
        Nuevo Orden de compra
      </Button>
      <Button
      onClick={clickBotton}
      disabled={isLoading}
      >
        {isLoading ? 'Generando...' : 'Generar Pedidos'}
      </Button>
      {isLoading ? (
              <div>
                <Loader />
              </div>
             ) : (
          <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Artículo</th>
              <th>Cantidad</th>
              <th>Proveedor</th>
              <th>Monto Total</th>
              <th>Fecha Pedido</th>
              <th>Fecha Llegada</th>
              <th>Estado</th>
              <th>Editar</th>
              <th>Cancelar</th>
            </tr>
          </thead>
          <tbody>
            {ordencompras.map((OC) => (
              <tr key={OC.id}>
                <td>{OC.id}</td>
                <td>{OC.articuloDTO?.nomArt}</td>
                <td>{OC.cantPedida}</td>
                <td>{OC.proveedorDTO?.nomProv}</td>
                <td>${OC.montoTotal?.toFixed(2) || '0.00'}</td>
                <td>{OC.fechaPedidoOrdCom}</td>
                <td>{OC.fechaLlegadaOrdCom}</td>
                <td>{OC.estadoOrdenCompraDTO?.nomEOC}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      handleClick("Editar artículo", OC, ModalType.UPDATE)
                    }
                    disabled={isLoading || OC.estadoOrdenCompraDTO?.id === 3 || OC.estadoOrdenCompraDTO?.id === 4}
                  >
                    {OC.estadoOrdenCompraDTO?.id === 1 ? "Enviada" :
                     OC.estadoOrdenCompraDTO?.id === 2 ? "Finalizar" :
                     "Editar"}
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleCancelarOrden(OC)}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {showModal && (
        <OrdenCompraModal
          show={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          orden={OrdenCompra}
          title={title}
          refreshData={setRefreshData}
          handleOrdenPendiente={handleOrdenPendiente}
          handleOrdenEnProceso={handleOrdenEnProceso}
          handleOrdenFinalizada={handleOrdenFinalizada}
        />
      )}
    </div>
  );
};

export default OrdenCompraTable;
