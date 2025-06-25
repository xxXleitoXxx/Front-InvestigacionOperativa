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
  
  find: function (arg0: (prov: any) => boolean): unknown {
    throw new Error("Function not implemented.");
  },
  id: 0,
  montototal: 0,
  fechaPedida: "",
  articuloDTO: null,
  estadoOrdenCompraDTO: null,
  cantPedida: 0,
  proveedorDTO: null
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
  const handleClick = (
    newTitle: string,
    OC: OrdenCompraDTO,
    modal: ModalType
  ) => {
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
              <th>Monto Total</th>
              <th>Articulo</th>
              <th>Cantidad</th>
              <th>Provedor</th>
              <th>Fecha Pedida</th>
              <th>Estado</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {ordencompras.map((OC) => (
              <tr key={OC.id}>
                <td>{OC.id}</td>
                <td>{OC.montototal}</td>
                <td>{OC.articuloDTO?.nomArt}</td>
                <td>{OC.cantPedida}</td>
                <td>{OC.proveedorDTO?.nomProv}</td>
                <td>{OC.fechaPedida}</td>
                <td>{OC.estadoOrdenCompraDTO?.nomEOC}</td>
                <td>
                  <EditButton
                    onClick={() =>
                      handleClick("Editar artículo", OC, ModalType.UPDATE)
                    }
                  />
                </td>
                <td>
                  <DeleteButton
                    onClick={() =>
                      handleClick("Borrar Artículo", OC, ModalType.DELETE)
                    }
                  />
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
          orden = {OrdenCompra}
          title={title}
          refreshData={setRefreshData}
        />
      )}
    </div>
  );
};

export default OrdenCompraTable;
