import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { ProveedorService } from "../../services/ProveedorService";
import type { ProveedorDTO } from "../../types/ProveedorDTO";
import type { ProveedorArticuloDTO } from "../../types/ProveedorArticuloDTO";
import ProveedorArticuloModal from "../ProveedorArticuloModal/ProveedorArticuloModal";
import { TipoLote } from "../../types/TipoLote";

type ProveedorModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  prov: ProveedorDTO;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProveedorModal = ({
  show,
  onHide,
  title,
  modalType,
  prov,
  refreshData,
}: ProveedorModalProps) => {
  const [showProveedorArticuloModal, setshowProveedorArticuloModal] =
    useState(false);
  
  const initializableNewProveedorArticuloDTO = (): ProveedorArticuloDTO => {
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
      TipoLote: TipoLote.LOTEFIJO, // Asumiendo que TipoLote puede ser null
      articuloDTO: {
        id: 0,
        codArt: "",
        nomArt: "",
        precioVenta: 0,
        descripcionArt: "",
        fechaHoraBajaArt: "", // Usamos string para representar la fecha en formato ISO
        stock: 0,
        stockSeguridad: 0,
        demandaDiaria: 0,
        desviacionEstandarUsoPeriodoEntrega: 0,
        desviacionEstandarDurantePeriodoRevisionEntrega: 0,
        proveedorDTO: null,
      },
      // Asumiendo que ArticuloDTO puede ser null
    };
  };

  //Const para setear el proveedor incializado
  const [proveedorArticuloDTO, setProveedorArticuloDTO] =
    useState<ProveedorArticuloDTO>(initializableNewProveedorArticuloDTO());

  // Const para manejar estado del modal
  const [ModalTypeProveedorArt, setModalTypeProveedorArt] = useState<ModalType>(
    ModalType.NONE
  );
  const [TitleProveedorArticulo, setTitleProveedorArticulo] = useState("");

  //Logica Modal
  const handleClick = (
    newTitle: string,
    provArt: ProveedorArticuloDTO,
    modal: ModalType
  ) => {
    setTitleProveedorArticulo(newTitle);
    setModalTypeProveedorArt(modal);
    setProveedorArticuloDTO(provArt);
    setshowProveedorArticuloModal(true);
  };

  const handleSaveUpdate = async (proveedor: ProveedorDTO) => {
    try {
      const isNew = proveedor.id === 0;
      if (isNew) {
        await ProveedorService.createProveedor(proveedor);
      } else {
        await ProveedorService.updateProveedor(proveedor.id, proveedor);
      }
      toast.success(
        isNew
          ? "Proveedor creado con éxito"
          : "Proveedor actualizado con éxito",
        {
          position: "top-center",
        }
      );
      onHide();
      refreshData((prevState) => !prevState);
    } catch (error) {
      console.error(error);
      toast.error(
        `Ha ocurrido un error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  const handleDelete = async () => {
    try {
      await ProveedorService.bajaLogicaProveedor(prov.id);
      toast.success("Proveedor eliminado con éxito", {
        position: "top-center",
      });
      onHide();
      refreshData((prevState) => !prevState);
    } catch (error) {
      console.error(error);
      toast.error(
        `Ha ocurrido un error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  const validationSchema = Yup.object().shape({
    id: Yup.number().integer().min(0),
    codProv: Yup.string().required("El código del proveedor es requerido"),
    nomProv: Yup.string().required("El nombre del proveedor es requerido"),
    descripcionProv: Yup.string(),

    
  });

  //Formulario
  const formik = useFormik({
    initialValues: {
      ...prov,
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: handleSaveUpdate,
  });


  return (
    <>
      {/*Modal Para Borrar*/}
      {modalType === ModalType.DELETE ? (
        <Modal show={show} onHide={onHide} centered backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              ¿Está seguro que desea eliminar el proveedor? <br />
              <strong>{prov.nomProv}</strong>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Eliminar
            </Button>
          </Modal.Footer>
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
            <Form onSubmit={formik.handleSubmit}>
              {/*CodProv*/}
              <Form.Group controlId="formCodProv">
                <Form.Label>Código del Proveedor</Form.Label>
                <Form.Control
                  name="codProv"
                  type="text"
                  value={formik.values.codProv || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(formik.touched.codProv && formik.errors.codProv)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.codProv}
                </Form.Control.Feedback>
                {/*nomProv*/}
              </Form.Group>
              <Form.Group controlId="formNomProv">
                <Form.Label>Nombre del Proveedor</Form.Label>
                <Form.Control
                  name="nomProv"
                  type="text"
                  value={formik.values.nomProv || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(formik.touched.nomProv && formik.errors.nomProv)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.nomProv}
                </Form.Control.Feedback>
              </Form.Group>
              {/*"descripcionProv"*/}
              <Form.Group controlId="formDescripcionProv">
                <Form.Label>Descripción del Proveedor</Form.Label>
                <Form.Control
                  name="descripcionProv"
                  type="text"
                  value={formik.values.descripcionProv || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(
                      formik.touched.descripcionProv &&
                      formik.errors.descripcionProv
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.descripcionProv}
                </Form.Control.Feedback>
              </Form.Group>
              {/*Hasta aca todo bien */}
              {/*
              <Form.Group controlId="formArticuloSearch">
                <Form.Label>Buscar Artículo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Buscar artículo..."
                  value={articuloSearch}
                  onChange={(e) => setArticuloSearch(e.target.value)}
                />
              </Form.Group>
              
              <Form.Group>
                <Form.Label>Artículos</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => {
                    const selectedArticulo = articulos.find(
                      (art) => art.id === Number(e.target.value)
                    );
                    if (selectedArticulo) {
                      addArticuloToProveedor(selectedArticulo);
                    }
                  }}
                >
                  <option value="">Seleccione un artículo</option>
                  {filteredArticulos.map((articulo) => (
                    <option key={articulo.id} value={articulo.id}>
                      {articulo.nomArt}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              
              <Form.Group>
                <Form.Label>Artículos Asignados</Form.Label>
                <ul>
                  {formik.values.proveedorArticulos.map((pa) => (
                    <li key={pa.id}>
                      {`Artículo: ${pa.articuloDTO.nomArt} - Precio: ${pa.costoUnitario} - Demora: ${pa.demoraEntrega} días - Costo Pedido: ${pa.costoPedido}`}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          formik.setFieldValue(
                            "proveedorArticulos",
                            formik.values.proveedorArticulos.filter(
                              (item) => item.id !== pa.id
                            )
                          );
                        }}
                      >
                        Eliminar
                      </Button>
                    </li>
                  ))}
                </ul>
              </Form.Group>
              */}
              <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                  Cancelar
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() =>
                    handleClick(
                      "ProveedorArticuloModal",
                      initializableNewProveedorArticuloDTO(),
                      ModalType.CREATE
                    )
                  }
                >
                  Asignar Articulos
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!formik.isValid}
                >
                  Guardar
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      )}
      {showProveedorArticuloModal && (
        <ProveedorArticuloModal
          show={showProveedorArticuloModal}
          onHide={() => setshowProveedorArticuloModal(false)}
          provArt={proveedorArticuloDTO}
          modalType={ModalTypeProveedorArt}
          title={TitleProveedorArticulo}
          onSave={setProveedorArticuloDTO}
        />
      )}
    </>
  );
};

export default ProveedorModal;
