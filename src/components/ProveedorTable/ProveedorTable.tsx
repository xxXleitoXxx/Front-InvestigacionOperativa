import { useEffect, useState } from "react";
import { ProveedorService } from "../../services/ProveedorService";
import Loader from "../Loader/Loader";
import { Button, Table } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import ProveedorModal from "../ProveedorModal/ProveedorModal";
import ArticulosProveedorModal from "../ProveedorModal/ArticulosProveedorModal";
import { EditButton } from "../EditButton/EditButton";
import { DeleteButton } from "../DeleteButton/DeleteButton";
import { ListButton } from "../ListButton/ListButton";
import type { ProveedorDTO } from "../../types/ProveedorDTO";

const ProveedorTable = () => {
  // Const para inicializar un proveedor por defecto y evitar el undefined
  const initializableNewProveedor = (): ProveedorDTO => {
    return {
      id: 0,
      codProv: "",
      nomProv: "",
      descripcionProv: "",
      fechaHoraBajaProv: "",
      proveedorArticulos: [],
    };
  };

  //Const para setear el proveedor incializado
  const [proveedor, setProveedor] = useState<ProveedorDTO>(
    initializableNewProveedor()
  );

  // Const para manejar estado del modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [title, setTitle] = useState("");

  // Estado para el modal de artículos del proveedor
  const [showArticulosModal, setShowArticulosModal] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<ProveedorDTO | null>(null);

  // Lógica del Modal
  const handleClick = (
    newTitle: string,
    prov: ProveedorDTO,
    modal: ModalType
  ) => {
    setTitle(newTitle);
    setModalType(modal);
    setProveedor(prov);
    setShowModal(true);
  };

  // Función para mostrar artículos del proveedor
  const handleShowArticulos = (proveedor: ProveedorDTO) => {
    setSelectedProveedor(proveedor);
    setShowArticulosModal(true);
  };

  // Variable que va a contener los datos recibido de la API
  const [proveedores, setProveedores] = useState<ProveedorDTO[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  // Variable que va a actualizar los datos de la tabla luego de cada operación exitosa
  const [refreshData, setRefreshData] = useState(false);

  // Este hook se va a ejecutar cada vez que se renderice el componente o refreshData cambie de estado
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const proveedores = await ProveedorService.getProveedores();
        setProveedores(proveedores);
        setIsLoading(false); // Solo ocultar loader cuando la promesa se resuelva exitosamente
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
        setProveedores([]); // Establecer array vacío en caso de error
        // No ocultar el loader en caso de error para que el usuario vea que hay un problema
      }
    };
    fetchProveedores();
  }, [refreshData]);

  //Tabla Proveedores
  return (
    <div>
      <h1>Tabla Proveedores</h1>
      {/*Boton que envia los parametros al Modal*/}
      <Button
        onClick={() =>
          handleClick(
            "Añadir Proveedor",
            initializableNewProveedor(),
            ModalType.CREATE
          )
        }
      >
        Nuevo Proveedor
      </Button>

      {isLoading ? (
        <Loader />
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Fecha de Baja</th>
              <th>Artículos</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((prove) => (
              <tr key={prove.id}>
                <td>{prove.id}</td>
                <td>{prove.codProv}</td>
                <td>{prove.nomProv}</td>
                <td>{prove.descripcionProv}</td>
                <td>
                  {prove.fechaHoraBajaProv
                    ? new Date(prove.fechaHoraBajaProv).toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  <ListButton
                    onClick={() => handleShowArticulos(prove)}
                  />
                </td>
                <td>
                  <EditButton
                    onClick={() =>
                      handleClick("Editar proveedor", prove, ModalType.UPDATE)
                    }
                  />
                </td>
                <td>
                  <DeleteButton
                    onClick={() =>
                      handleClick("Borrar proveedor", prove, ModalType.DELETE)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {showModal && (
        <ProveedorModal
          show={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          prov={proveedor}
          title={title}
          refreshData={setRefreshData}
        />
      )}
      {showArticulosModal && selectedProveedor && (
        <ArticulosProveedorModal
          show={showArticulosModal}
          onHide={() => setShowArticulosModal(false)}
          proveedor={selectedProveedor}
        />
      )}
    </div>
  );
};

export default ProveedorTable;
