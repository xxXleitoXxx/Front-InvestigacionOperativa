import { useState } from "react";
import { TipoLote } from "../../types/TipoLote";
import type { ProveedorArticuloDTO } from "../../types/ProveedorArticuloDTO";
import { ModalType } from "../../types/ModalType";
import { Button, Modal, Table } from "react-bootstrap";
import { EditButton } from "../EditButton/EditButton";
import { DeleteButton } from "../DeleteButton/DeleteButton";
import ProveedorArticuloAtributoModal from "../ProveedorArticuloAtributoModal/ProveedorArticuloAtributoModal";

type ProveedorArticuloModalProps = {
  show: boolean;
  onHide: () => void;
  provArt: ProveedorArticuloDTO | null;
  modalType: ModalType;
  title: string;
  onSave: (proveedorArticulo: ProveedorArticuloDTO) => void;
};
<div></div>;
const ProveedorArticuloModal = ({
  show,
  onHide,
  provArt,
  onSave,
  modalType,
  title,
}: ProveedorArticuloModalProps) => {
  const [proveedorArticulo, setProveedorArticulo] =
    useState<ProveedorArticuloDTO>({
      id: 0,
      fechaHoraBajaArtProv: "",
      costoGeneralInventario: 0,
      demoraEntrega: 0,
      nivelDeServicio: 0,
      costoUnitario: 0,
      costoPedido: 0,
      costoMantenimiento: 0,
      loteOptimo: 0,
      puntoPedido: 0,
      cantidadAPedir: 0,
      inventarioMaximo: 0,
      periodoRevision: 0,
      TipoLote: TipoLote.LOTEFIJO,
      articuloDTO: {
        id: 0,
        codArt: "",
        nomArt: "",
        precioVenta: 0,
        descripcionArt: "",
        fechaHoraBajaArt: "",
        stock: 0,
        stockSeguridad: 0,
        demandaDiaria: 0,
        desviacionEstandarUsoPeriodoEntrega: 0,
        desviacionEstandarDurantePeriodoRevisionEntrega: 0,
        proveedorDTO: {
          id: 0,
          codProv: "",
          nomProv: "",
          descripcionProv: "",
          fechaHoraBajaProv: "",
          proveedorArticulos: [],
        },
      },
    });

  const [refreshData2, setRefreshData] = useState(false);
  const [proveedoresArticuloTable, setProveedoresArticuloTable] = useState<
    ProveedorArticuloDTO[]
  >([
    {
      id: 0,
      fechaHoraBajaArtProv: "",
      costoGeneralInventario: 0,
      demoraEntrega: 0,
      nivelDeServicio: 0,
      costoUnitario: 0,
      costoPedido: 0,
      costoMantenimiento: 0,
      loteOptimo: 0,
      puntoPedido: 0,
      cantidadAPedir: 0,
      inventarioMaximo: 0,
      periodoRevision: 0,
      TipoLote: TipoLote.LOTEFIJO,
      articuloDTO: {
        id: 0,
        codArt: "",
        nomArt: "",
        precioVenta: 0,
        descripcionArt: "",
        fechaHoraBajaArt: "",
        stock: 0,
        stockSeguridad: 0,
        demandaDiaria: 0,
        desviacionEstandarUsoPeriodoEntrega: 0,
        desviacionEstandarDurantePeriodoRevisionEntrega: 0,
        proveedorDTO: {
          id: 0,
          codProv: "",
          nomProv: "",
          descripcionProv: "",
          fechaHoraBajaProv: "",
          proveedorArticulos: [],
        },
      },
    },
  ]);

  const initializableNewProvArt = (): ProveedorArticuloDTO => {
    return {
      id: 0,
      fechaHoraBajaArtProv: "",
      costoGeneralInventario: 0,
      demoraEntrega: 0,
      nivelDeServicio: 0,
      costoUnitario: 0,
      costoPedido: 0,
      costoMantenimiento: 0,
      loteOptimo: 0,
      puntoPedido: 0,
      cantidadAPedir: 0,
      inventarioMaximo: 0,
      periodoRevision: 0,
      TipoLote: TipoLote.LOTEFIJO,
      articuloDTO: {
        id: 0,
        codArt: "",
        nomArt: "",
        precioVenta: 0,
        descripcionArt: "",
        fechaHoraBajaArt: "",
        stock: 0,
        stockSeguridad: 0,
        demandaDiaria: 0,
        desviacionEstandarUsoPeriodoEntrega: 0,
        desviacionEstandarDurantePeriodoRevisionEntrega: 0,
        proveedorDTO: {
          id: 0,
          codProv: "",
          nomProv: "",
          descripcionProv: "",
          fechaHoraBajaProv: "",
          proveedorArticulos: [],
        },
      },
    };
  };

  // const handleChange = (e: React.ChangeEvent<FormControl>) => {
  //   const { name, value } = e.target;
  //   setProveedorArticulo({ ...proveedorArticulo, [name]: value });
  // };

  const handleSubmit = () => {
    onSave(proveedorArticulo);
    onHide();
  };
  //Modal Añadir Articulos
  // Constantes para manejar el estado del modal
  const [showModalProvArt, setshowModalProvArt] = useState(false);
  const [modalTypeProvArt, setmodalTypeProvArt] = useState<ModalType>(
    ModalType.NONE
  );
  const [titleProvArt, setTitleProvArt] = useState("");

  // Lógica del Modal
  const handleClick = (
    newTitle: string,
    ProvArtAtri: ProveedorArticuloDTO,
    modal: ModalType
  ) => {
    setTitleProvArt(newTitle);
    setmodalTypeProvArt(modal);
    setProveedorArticulo(ProvArtAtri);
    setshowModalProvArt(true);
  };

  return (
    <div>
      {modalType === ModalType.DELETE ? (
        <Modal show={show} onHide={onHide} centered backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
        </Modal>
      ) : (
        <Modal
          show={show}
          onHide={onHide}
          centered
          backdrop="static"
          className="modal-xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="p-1">
              <Button
                type="button"
                variant="primary"
                onClick={() =>
                  handleClick(
                    "Añadir Artículo",
                    initializableNewProvArt(),
                    ModalType.CREATE
                  )
                }
              >
                Añadir Articulos
              </Button>
            </div>
            <div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <td>Articulo</td>
                    <td>DemoraEntrega</td>
                    <td>CostoUnitario</td>
                    <td>CostoMantenimiento</td>
                    <td>CantidadAPedir</td>
                    <td>PeriodoRevision</td>
                    <td>TipoLote</td>
                    <td>Editar</td>
                    <td>Eliminar</td>
                  </tr>
                </thead>
                <tbody>
                  {proveedoresArticuloTable.map((provarti) => (
                    <tr key={provarti.id}>
                      <td>{provarti.articuloDTO.nomArt}</td>
                      <td>{provarti.demoraEntrega}</td>
                      <td>{provarti.costoUnitario}</td>
                      <td>{provarti.costoMantenimiento}</td>
                      <td>{provarti.cantidadAPedir}</td>
                      <td>{provarti.periodoRevision}</td>
                      <td>{provarti.TipoLote}</td>
                      <td>
                        <EditButton
                          onClick={() =>
                            handleClick(
                              "Editar artículo",
                              provarti,
                              ModalType.UPDATE
                            )
                          }
                        />
                      </td>
                      <td>
                        <DeleteButton
                          onClick={() =>
                            handleClick(
                              "Borrar Artículo",
                              provarti,
                              ModalType.DELETE
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>

            <Button variant="primary" onClick={handleSubmit}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {showModalProvArt && (
        <ProveedorArticuloAtributoModal
          showModalProvArti={showModalProvArt}
          onHide={() => setshowModalProvArt(false)}
          modalTypeProvArt={modalTypeProvArt}
          provArtatri={proveedorArticulo}
          titleProvArt={titleProvArt}
          refreshData2={setRefreshData2}
        />
      )}
    </div>
  );
};
export default ProveedorArticuloModal;
