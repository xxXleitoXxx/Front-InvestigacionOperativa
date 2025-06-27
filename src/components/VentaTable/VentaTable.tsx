import { useEffect, useState } from "react";
import { VentaService } from "../../services/VentaService";
import Loader from "../Loader/Loader";
import { Button, Table } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import ProveedorModal from "../ProveedorModal/ProveedorModal";
import { EditButton } from "../EditButton/EditButton";
import { DeleteButton } from "../DeleteButton/DeleteButton";
import type { ProveedorDTO } from "../../types/ProveedorDTO";
import type { VentaDTO } from "../../types/VentaDto";
import VentaModal from "../VentaModal/VentaModal";

const VentaTable = () => {
  // Const para inicializar un proveedor por defecto y evitar el undefined
  const initializableNewVenta = (): VentaDTO => {
    return {
    id: 0,
    fechaHoraVentDTO: "",
    montoTotalVentDTO: 0,
    ventaArticuloDTOS: []
};
  };

  // Const para manejar el estado del modal
  const [venta, setVenta] = useState<VentaDTO>(
    initializableNewVenta()
  );

  // Const para manejar estado del modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [title, setTitle] = useState("");

  // Lógica del Modal
  const handleClick = (
    newTitle: string,
    vent: VentaDTO,
    modal: ModalType
  ) => {
    setTitle(newTitle);
    setModalType(modal);
    setVenta(venta);
    setShowModal(true);
  };

  // Variable que va a contener los datos recibido de la API
  const [ventas, setVentas] = useState<VentaDTO[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  // Variable que va a actualizar los datos de la tabla luego de cada operación exitosa
  const [refreshData, setRefreshData] = useState(false);

  // Este hook se va a ejecutar cada vez que se renderice el componente o refreshData cambie de estado
  useEffect(() => {
    const fetchVenta = async () => {
      try {
        const ventas = await VentaService.getVentas();
        setVentas(ventas);
        setIsLoading(false); // Solo ocultar loader cuando la promesa se resuelva exitosamente
      } catch (error) {
        console.error("Error al obtener ventas:", error);
        setVentas([]); // Establecer array vacío en caso de error
        // No ocultar el loader en caso de error para que el usuario vea que hay un problema
      }
    };
    fetchVenta();
  }, [refreshData]);

  return (
    <div>
      <h1>Tabla Ventas</h1>
      <Button
        onClick={() =>
          handleClick(
            "Añadir Venta",
            initializableNewVenta(),
            ModalType.CREATE
          )
        }
      >
        Nueva Venta
      </Button>
      {isLoading ? (
        <Loader />
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Id</th>
              <th>MontoTotal</th>
              <th>FechaVenta</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id}>
                <td>{venta.id}</td>
                <td>{venta.montoTotalVentDTO}</td>
                <td>{venta.fechaHoraVentDTO}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}{showModal && (
        <VentaModal
          show={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          vent={venta}
          title={title}
          refreshData={setRefreshData}
        />
      )}
    </div>
  );
};

export default VentaTable;
