import {
  Button,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalTitle,
} from "react-bootstrap";
import { ModalType } from "../../types/ModalType";

//dependencia para validar Formulario
import * as Yup from "yup";
import { useFormik } from "formik";

//notificaciones al usuario
import { toast } from "react-toastify";
import React from "react";
import type { Articulo } from "../../types/Articulo";
import { ArticuloService } from "../../services/ArticuloSevice";

type ArticuloModalProps = {
  show: boolean;
  onHide: () => void;
  title: String;
  modalType: ModalType;
  art: Articulo;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};
const ProveedorModal = ({
  show,
  onHide,
  modalType,
  art,
  title,
  refreshData,
}: ArticuloModalProps) => {
  //CREATE-UPDATE
  const handleSaveUpdate = async (arti: Articulo) => {
    try {
      const isNew = arti.id === 0;
      if (isNew) {
        await ArticuloService.createArticulo(arti);
      } else {
        await ArticuloService.updateArticulo(arti.id, arti);
      }
      toast.success(
        isNew ? "Articulo Creado Con Exito" : "Articulo Actualizado Con Exito",
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
  //Delete
  //Metodo Delete Fisico Deprecado
  /*
  const handleDelete = async () => {
    try {
      await ProveedorService.deleteProveedor(prov.id);
      toast.success("Proveedor eliminado con éxito", {
        position: "top-center",
      });
      onHide();
      refreshData((prevState) => !prevState);
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error");
    }
  };*/
  const handleDelete = async () => {
    try {
      await ArticuloService.bajaLogicaArticulo(art.id, art);
      toast.success("Articulo eliminado con éxito", {
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
    id: Yup.number().integer().min(0).required("El ID es requerido"),
    codArt: Yup.string().required("El código del artículo es requerido"),
    nomArt: Yup.string().required("El nombre del artículo es requerido"),
    precioVenta: Yup.number()
      .positive("El precio de venta debe ser un numero mayor a 0")
      .required("El precio de venta es requerido"),
    descripcionArt: Yup.string().required(
      "La descripción del artículo es requerida"
    ),

    // Atributos para cálculo de inventario
    stock: Yup.number()
      .integer()
      .min(0, "El stock debe ser al menos 0")
      .required("El stock es requerido"),
    stockSeguridad: Yup.number()
      .integer()
      .min(0, "El stock de seguridad debe ser al menos 0")
      .required("El stock de seguridad es requerido"),
    costoGeneralInventario: Yup.number()
      .min(0, "El costo general del inventario debe ser al menos 0")
      .required("El costo general del inventario es requerido"),

    // Lote fijo
    loteOptimo: Yup.number()
      .integer()
      .min(0, "El lote óptimo debe ser al menos 0")
      .required("El lote óptimo es requerido"),
    puntoPedido: Yup.number()
      .integer()
      .min(0, "El punto de pedido debe ser al menos 0")
      .required("El punto de pedido es requerido"),

    // Periodo fijo
    inventarioMaximo: Yup.number()
      .integer()
      .min(0, "El inventario máximo debe ser al menos 0")
      .required("El inventario máximo es requerido"),
    tipoLote: Yup.mixed().nullable().default(null),

    // Relaciones
    proveedorElegido: Yup.mixed().nullable().default(null),
  });

  //formik, utiliza el esquema de validacion para crear un formulario dinámico
  //Y que lo que bloquea el formulario en caso de haber errores

  const formik = useFormik({
    initialValues: art,
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (obj: Articulo) => handleSaveUpdate(obj),
  });

  return (
    <>
      {modalType === ModalType.DELETE ? (
        <>
          <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
              <ModalTitle>{title}</ModalTitle>
            </Modal.Header>

            <Modal.Body>
              <p>
                ¿Esta seguro que desea eliminar el Articulo?
                <br />
                <strong>{art.nomArt}</strong>
              </p>
            </Modal.Body>

            <ModalFooter>
              <Button variant="secondary" onClick={onHide}>
                Cancelar
              </Button>
              <Button variant="secondary" onClick={handleDelete}>
                Eliminar
              </Button>
            </ModalFooter>
          </Modal>
        </>
      ) : (
        <>
          <Modal
            show={show}
            onHide={onHide}
            centered
            backdrop="static"
            className="modal-x1"
          >
            <Modal.Header closeButton>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <ModalBody>
              <Form onSubmit={formik.handleSubmit}>
                {/* Campo "codArt" */}
                <Form.Group controlId="formCodArt">
                  <Form.Label>Código del Artículo</Form.Label>
                  <Form.Control
                    name="codArt"
                    type="text"
                    value={formik.values.codArt || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={Boolean(
                      formik.errors.codArt && formik.touched.codArt
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.codArt}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Campo "nomArt" */}
                <Form.Group controlId="formNomArt">
                  <Form.Label>Nombre del Artículo</Form.Label>
                  <Form.Control
                    name="nomArt"
                    type="text"
                    value={formik.values.nomArt || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={Boolean(
                      formik.errors.nomArt && formik.touched.nomArt
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.nomArt}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Campo "precioVenta" */}
                <Form.Group controlId="formPrecioVenta">
                  <Form.Label>Precio de Venta</Form.Label>
                  <Form.Control
                    name="precioVenta"
                    type="number"
                    value={formik.values.precioVenta || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={Boolean(
                      formik.errors.precioVenta && formik.touched.precioVenta
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.precioVenta}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Campo "descripcionArt" */}
                <Form.Group controlId="formDescripcionArt">
                  <Form.Label>Descripción del Artículo</Form.Label>
                  <Form.Control
                    name="descripcionArt"
                    type="text"
                    value={formik.values.descripcionArt || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={Boolean(
                      formik.errors.descripcionArt &&
                        formik.touched.descripcionArt
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.descripcionArt}
                  </Form.Control.Feedback>
                </Form.Group>
                <Modal.Footer>
                  <Button variant="secondary" onClick={onHide}>
                    Cancelar
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
            </ModalBody>
          </Modal>
        </>
      )}
    </>
  );
};

export default ProveedorModal;
