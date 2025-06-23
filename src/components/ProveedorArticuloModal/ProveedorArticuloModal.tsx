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
  proveedorArticulos: ProveedorArticuloDTO[];
};

const ProveedorArticuloModal = ({
  show,
  onHide,
  provArt,
  modalType,
  title,
  onSave,
  proveedorArticulos,
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

  const [showModalProvArt, setShowModalProvArt] = useState(false);
  const [modalTypeProvArt, setModalTypeProvArt] = useState<ModalType>(
    ModalType.NONE
  );
  const [titleProvArt, setTitleProvArt] = useState("");

  const handleClick = (
    newTitle: string,
    provArtAtri: ProveedorArticuloDTO,
    modal: ModalType
  ) => {
    setTitleProvArt(newTitle);
    setModalTypeProvArt(modal);
    setProveedorArticulo(provArtAtri);
    setShowModalProvArt(true);
  };

  const handleSubmit = () => {
    onHide();
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
                    proveedorArticulo,
                    ModalType.CREATE
                  )
                }
              >
                Añadir Artículos
              </Button>
            </div>
            <div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <td>Artículo</td>
                    <td>Demora Entrega</td>
                    <td>Costo Unitario</td>
                    <td>Costo Mantenimiento</td>
                    <td>Cantidad a Pedir</td>
                    <td>Período Revisión</td>
                    <td>Tipo Lote</td>
                    <td>Editar</td>
                    <td>Eliminar</td>
                  </tr>
                </thead>
                <tbody>
                  {proveedorArticulos.map((provArti) => (
                    <tr key={provArti.id}>
                      <td>{provArti.articuloDTO.nomArt}</td>
                      <td>{provArti.demoraEntrega}</td>
                      <td>{provArti.costoUnitario}</td>
                      <td>{provArti.costoMantenimiento}</td>
                      <td>{provArti.cantidadAPedir}</td>
                      <td>{provArti.periodoRevision}</td>
                      <td>{provArti.TipoLote}</td>
                      <td>
                        <EditButton
                          onClick={() =>
                            handleClick(
                              "Editar artículo",
                              provArti,
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
                              provArti,
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
          onHide={() => setShowModalProvArt(false)}
          modalTypeProvArt={modalTypeProvArt}
          provArtatri={proveedorArticulo}
          titleProvArt={titleProvArt}
          onSave={onSave}
        />
      )}
    </div>
  );
};

export default ProveedorArticuloModal;
