import { useEffect, useState } from "react";
import { ProveedorService } from "../../services/ProveedorService";
import Loader from "../Loader/Loader";
import { Button, Table } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import ProveedorModal from "../ProveedorModal/ProveedorModal";
import { EditButton } from "../EditButton/EditButton";
import { DeleteButton } from "../DeleteButton/DeleteButton";
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
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
      } finally {
        setIsLoading(false);
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
    </div>
  );
};

export default ProveedorTable;
