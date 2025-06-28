import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { ProveedorService } from "../../services/ProveedorService";
import type { ArticuloDTO } from "../../types/ArticuloDTO";
import type { ProveedorDTO } from "../../types/ProveedorDTO";
import { ArticuloService } from "../../services/ArticuloSevice";

type ArticuloModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  art: ArticuloDTO;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const ArticuloModal = ({
  show,
  onHide,
  title,
  modalType,
  art,
  refreshData,
}: ArticuloModalProps) => {
  const [proveedores, setProveedores] = useState<ProveedorDTO[]>([]);
  const [proveedorSearch, setProveedorSearch] = useState("");
  const [selectedProveedorCod, setSelectedProveedorCod] = useState<string>("");
  /////---------------------------Peticiones--------------------------------////
  //GET proveedores fetch
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const data = await ProveedorService.getProveedores();
        setProveedores(data);
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
        toast.error(
          `Error al cargar proveedores: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    };

    fetchProveedores();
  }, []);

  // Initialize selectedProveedorCod when art changes
  useEffect(() => {
    if (art.proveedorDTO?.codProv) {
      setSelectedProveedorCod(art.proveedorDTO.codProv);
    } else {
      setSelectedProveedorCod("");
    }
  }, [art]);
  //POST y PUT ArticulosDTO
  const handleSaveUpdate = async (arti: ArticuloDTO) => {
    try {
      console.log("=== ARTÍCULO A ENVIAR ===");
      console.log("Artículo completo:", arti);
      console.log("ID:", arti.id);
      console.log("Código:", arti.codArt);
      console.log("Nombre:", arti.nomArt);
      console.log("Precio:", arti.precioVenta);
      console.log("Stock:", arti.stock);
      console.log("Proveedor:", arti.proveedorDTO);
      console.log("Proveedor ID:", arti.proveedorDTO?.id);
      console.log("Proveedor Nombre:", arti.proveedorDTO?.nomProv);
      console.log("==========================");

      const isNew = arti.id === 0;
      if (isNew) {
        await ArticuloService.createArticulo(arti);
      } else {
        await ArticuloService.updateArticulo(arti);
      }
      toast.success(
        isNew ? "Artículo creado con éxito" : "Artículo actualizado con éxito",
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

  //Dar de AltaLogica(despues de eliminar)
  const handleAltaLogica = async () => {
    try {
      await ArticuloService.altaLogicaArticulo(art);
    } catch (error) {
      console.error(error);
      toast.error(
        `Ha ocurrido un error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };
  //baja Logica Articulos
  const handleDelete = async () => {
    try {
      console.log(art.nomArt);
      await ArticuloService.bajaLogicaArticulo(art);
      toast.success("Artículo eliminado con éxito", {
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

  /////---------------------------Peticiones--------------------------------////

  /////---------------------------Logica y Metodos--------------------------------////

  /////---------------------------Formulario--------------------------------////
  //esquema de validacion de formulario

  const validationSchema = Yup.object().shape({
    id: Yup.number().integer().min(0).required("El ID es requerido"),
    codArt: Yup.string().required("El código del artículo es requerido"),
    nomArt: Yup.string().required("El nombre del artículo es requerido"),
    precioVenta: Yup.number()
      .positive("El precio de venta debe ser un número mayor a 0")
      .required("El precio de venta es requerido"),
    stock: Yup.number()
      .integer()
      .min(0, "El stock debe ser al menos 0")
      .required("El stock es requerido"),
    demandaDiaria: Yup.number()
      .positive("La demanda diaria debe ser mayor a cero")
      .required("La demanda diaria es requerida"),
    desviacionEstandarUsoPeriodoEntrega: Yup.number()
      .positive("La desviación estándar en el uso debe ser mayor a cero")
      .required("La desviación estándar en el uso es requerida"),
    desviacionEstandarDurantePeriodoRevisionEntrega: Yup.number()
      .positive(
        "La desviación estándar durante el período de revisión debe ser mayor a cero"
      )
      .required(
        "La desviación estándar durante el período de revisión es requerida"
      ),
  });

  //formik InicialValues
  const formik = useFormik({
    initialValues: {
      ...art,
      demandaDiaria: art.demandaDiaria || 1,
      desviacionEstandarUsoPeriodoEntrega:
        art.desviacionEstandarUsoPeriodoEntrega || 1,
      desviacionEstandarDurantePeriodoRevisionEntrega:
        art.desviacionEstandarDurantePeriodoRevisionEntrega || 1,
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: handleSaveUpdate,
  });
  /////---------------------------Formulario--------------------------------////

  return (
    <>
      {/* depende de la peticion del padre es el modal que se muestra */}
      {modalType === ModalType.DELETE ? (
        <Modal show={show} onHide={onHide} centered backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              ¿Está seguro que desea eliminar el artículo? <br />
              <strong>{art.nomArt}</strong>
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
      ) : modalType === ModalType.ALTA ? (
        <Modal show={show} onHide={onHide} centered backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              ¿Está seguro que desea dar de Alta el artículo? <br />
              <strong>{art.nomArt}</strong>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleAltaLogica}>
              Dar de alta
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
              <Form.Group controlId="formCodArt">
                <Form.Label>Código del Artículo</Form.Label>
                <Form.Control
                  name="codArt"
                  type="text"
                  value={formik.values.codArt || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.errors.codArt && formik.touched.codArt)}
                  disabled={modalType !== ModalType.CREATE}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.codArt}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formNomArt">
                <Form.Label>Nombre del Artículo</Form.Label>
                <Form.Control
                  name="nomArt"
                  type="text"
                  value={formik.values.nomArt || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.errors.nomArt && formik.touched.nomArt)}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.nomArt}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formPrecioVenta">
                <Form.Label>Precio de Venta</Form.Label>
                <Form.Control
                  name="precioVenta"
                  type="number"
                  value={formik.values.precioVenta || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(formik.errors.precioVenta && formik.touched.precioVenta)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.precioVenta}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formDescripcionArt">
                <Form.Label>Descripción del Artículo</Form.Label>
                <Form.Control
                  name="descripcionArt"
                  type="text"
                  value={formik.values.descripcionArt || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(
                      formik.errors.descripcionArt &&
                      formik.touched.descripcionArt
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.descripcionArt}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formStock">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  name="stock"
                  type="number"
                  value={formik.values.stock || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.errors.stock && formik.touched.stock)}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.stock}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formDemandaDiaria">
                <Form.Label>Demanda Diaria</Form.Label>
                <Form.Control
                  name="demandaDiaria"
                  type="number"
                  value={formik.values.demandaDiaria || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(
                      formik.errors.demandaDiaria &&
                      formik.touched.demandaDiaria
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.demandaDiaria}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formDesviacionEstandarUsoPeriodoEntrega">
                <Form.Label>Desviación Estándar Uso Periodo Entrega</Form.Label>
                <Form.Control
                  name="desviacionEstandarUsoPeriodoEntrega"
                  type="number"
                  value={
                    formik.values.desviacionEstandarUsoPeriodoEntrega || ""
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(
                      formik.errors.desviacionEstandarUsoPeriodoEntrega &&
                      formik.touched.desviacionEstandarUsoPeriodoEntrega
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.desviacionEstandarUsoPeriodoEntrega}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formDesviacionEstandarDurantePeriodoRevisionEntrega">
                <Form.Label>
                  Desviación Estándar Durante Periodo Revisión Entrega
                </Form.Label>
                <Form.Control
                  name="desviacionEstandarDurantePeriodoRevisionEntrega"
                  type="number"
                  value={
                    formik.values
                      .desviacionEstandarDurantePeriodoRevisionEntrega || ""
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(
                      formik.errors
                        .desviacionEstandarDurantePeriodoRevisionEntrega &&
                      formik.touched
                        .desviacionEstandarDurantePeriodoRevisionEntrega
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {
                    formik.errors
                      .desviacionEstandarDurantePeriodoRevisionEntrega
                  }
                </Form.Control.Feedback>
              </Form.Group>

              {modalType !== ModalType.CREATE && (
                <>
                  <Form.Group controlId="formProveedorSearch">
                    <Form.Label>Buscar Proveedor</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Buscar proveedor..."
                      value={proveedorSearch}
                      onChange={(e) => setProveedorSearch(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="formProveedorElegido">
                    <Form.Label>Proveedor</Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedProveedorCod}
                      onChange={(e) => {
                        const proveedorCod = e.target.value;
                        setSelectedProveedorCod(proveedorCod);
                        const selectedProveedor = proveedores.find(
                          (prov) => prov.codProv === proveedorCod
                        );
                        formik.setFieldValue(
                          "proveedorDTO",
                          selectedProveedor || null
                        );
                      }}
                      isInvalid={
                        !!(
                          formik.errors.proveedorDTO && formik.touched.proveedorDTO
                        )
                      }
                    >
                      <option value="">Seleccione un proveedor</option>
                      {proveedores.map((proveedor, index) => (
                        <option
                          key={`proveedor-${index}`}
                          value={proveedor.codProv}
                        >
                          {proveedor.nomProv}
                        </option>
                      ))}
                    </Form.Control>
                    {formik.errors.proveedorDTO && formik.touched.proveedorDTO && (
                      <div style={{ color: "red" }}>Error en el proveedor</div>
                    )}
                  </Form.Group>
                </>
              )}

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
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default ArticuloModal;
