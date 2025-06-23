//Falta Logica de como mandar el formulario a la clase Padre

import React, { useEffect, useState } from "react";
import { ModalType } from "../../types/ModalType";
import type { ProveedorArticuloDTO } from "../../types/ProveedorArticuloDTO";
import { ArticuloService } from "../../services/ArticuloSevice";
import { toast } from "react-toastify";
import type { ArticuloDTO } from "../../types/ArticuloDTO";
import { Button, Form, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { useFormik } from "formik";

type ProveedorArticulAtributoModalProps = {
  showModalProvArti: boolean;
  onHide: () => void;
  modalTypeProvArt: ModalType;
  provArtatri: ProveedorArticuloDTO;
  titleProvArt: string;
  onSave: (proveedorArticulo: ProveedorArticuloDTO) => void;
};

const ProveedorArticuloAtributoModal = ({
  showModalProvArti,
  onHide,
  modalTypeProvArt,
  provArtatri,
  titleProvArt,
  
}: ProveedorArticulAtributoModalProps) => {
  //Variables para Articulos
  const [articulos, setArticulos] = useState<ArticuloDTO[]>([]);
  const [articuloSearch, setArticuloSearch] = useState("");
  //Modal

  //fetchArticulos
  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const data = await ArticuloService.getArticulos(); //tenemos que ver que sean los disponibles
        setArticulos(data);
      } catch (error) {
        console.error("Error al obtener articulos:", error);
        toast.error(
          `Error al cargar articulos: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    };

    fetchArticulos();
  }, []);
  //yup
  const validationSchema = Yup.object().shape({});
  const handleSaveUpdate =  (provearti: ProveedorArticuloDTO) => {
    
    onSave(provearti);
      const isNew = provearti.id === 0;
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

  const formik = useFormik({
    initialValues: {
      ...provArtatri,
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: handleSubmit,
  });

  //
  const filteredArticulos = articulos.filter((articulo) =>
    articulo.nomArt.toLowerCase().includes(articuloSearch.toLowerCase())
  );
  return (
    <div>
      {modalTypeProvArt === ModalType.DELETE ? (
        <Modal
          showModalProvArti={showModalProvArti}
          onHide={onHide}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>{titleProvArt}</Modal.Title>
          </Modal.Header>
        </Modal>
      ) : (
        <Modal
          showModalProvArti={showModalProvArti}
          onHide={onHide}
          centered
          backdrop="static"
          className="modal-xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>{titleProvArt}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group controlId="formDemoraEntrega">
                <Form.Label>DemoraEntrega</Form.Label>
                <Form.Control
                  name="DemoraEntrega"
                  type="number"
                  value={formik.values.demoraEntrega || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(
                      formik.errors.demoraEntrega &&
                      formik.touched.demoraEntrega
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.demoraEntrega}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formCostoUnitario">
                <Form.Label>CostoUnitario</Form.Label>
                <Form.Control
                  name="CostoUnitario"
                  type="number"
                  value={formik.values.costoUnitario || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(
                      formik.errors.costoUnitario &&
                      formik.touched.costoUnitario
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.costoUnitario}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formCostoMantenimiento">
                <Form.Label>CostoMantenimiento</Form.Label>
                <Form.Control
                  name="CostoMantenimiento"
                  type="number"
                  value={formik.values.costoMantenimiento || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(
                      formik.errors.costoMantenimiento &&
                      formik.touched.costoMantenimiento
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.costoMantenimiento}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formCantidad A pedir">
                <Form.Label>CantidadAPedir</Form.Label>
                <Form.Control
                  name="CantidadAPedir"
                  type="number"
                  value={formik.values.cantidadAPedir || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(
                      formik.errors.cantidadAPedir &&
                      formik.touched.cantidadAPedir
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.cantidadAPedir}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formPeriodoRevision">
                <Form.Label>PeriodoRevision</Form.Label>
                <Form.Control
                  name="demandaDiaria"
                  type="number"
                  value={formik.values.periodoRevision || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(
                      formik.errors.periodoRevision &&
                      formik.touched.periodoRevision
                    )
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.periodoRevision}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="Tipo Lote">
                <Form.Label>TipoLote</Form.Label>
                <Form.Control
                  as="select"
                  name="TipoLote"
                  value={formik.values.TipoLote || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(formik.errors.TipoLote && formik.touched.TipoLote)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.TipoLote}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formArticuloSearch">
                <Form.Label>Buscar Articulo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Buscar articulo..."
                  value={articuloSearch}
                  onChange={(e) => setArticuloSearch(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formArticuloElegido">
                <Form.Label>Articulo</Form.Label>
                <Form.Control
                  as="select"
                  name="proveedorDTO.id"
                  value={formik.values.articuloDTO?.id || ""}
                  onChange={(e) => {
                    const selectedArticulo = articulos.find(
                      (art) => art.id === Number(e.target.value)
                    );
                    formik.setFieldValue(
                      "articuloDTO",
                      selectedArticulo || null
                    );
                  }}
                  isInvalid={
                    !!(formik.errors.articuloDTO && formik.touched.articuloDTO)
                  }
                >
                  <option value="">Seleccione un proveedor</option>
                  {filteredArticulos.map((articulo) => (
                    <option key={articulo.id} value={articulo.id}>
                      {articulo.nomArt}
                    </option>
                  ))}
                </Form.Control>
                {formik.errors.articuloDTO && formik.touched.articuloDTO && (
                  <div style={{ color: "red" }}>Error en el proveedor</div>
                )}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>

            <Button variant="primary" type="submit" disabled={!formik.isValid}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ProveedorArticuloAtributoModal;
