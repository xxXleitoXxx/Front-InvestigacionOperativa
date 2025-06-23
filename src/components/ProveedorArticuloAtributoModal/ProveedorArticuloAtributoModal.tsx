import { useEffect, useState } from "react";
import { ModalType } from "../../types/ModalType";
import type { ProveedorArticuloDTO } from "../../types/ProveedorArticuloDTO";
import { toast } from "react-toastify";
import type { ArticuloDTO } from "../../types/ArticuloDTO";
import { Button, Form, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ArticuloService } from "../../services/ArticuloSevice";

type ProveedorArticuloAtributoModalProps = {
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
  onSave,
}: ProveedorArticuloAtributoModalProps) => {
  const [articulos, setArticulos] = useState<ArticuloDTO[]>([]);
  const [articuloSearch, setArticuloSearch] = useState("");

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const data = await ArticuloService.getArticulos();
        setArticulos(data);
      } catch (error) {
        console.error("Error al obtener artículos:", error);
        toast.error(
          `Error al cargar artículos: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    };

    fetchArticulos();
  }, []);

  const validationSchema = Yup.object().shape({
    demoraEntrega: Yup.number().required("La demora de entrega es requerida"),
    costoUnitario: Yup.number().required("El costo unitario es requerido"),
    costoMantenimiento: Yup.number().required(
      "El costo de mantenimiento es requerido"
    ),
    cantidadAPedir: Yup.number().required("La cantidad a pedir es requerida"),
    periodoRevision: Yup.number().required(
      "El período de revisión es requerido"
    ),
    TipoLote: Yup.string().required("El tipo de lote es requerido"),
    articuloDTO: Yup.object().shape({
      id: Yup.number().required("El artículo es requerido"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      ...provArtatri,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSave(values);
      toast.success("Artículo guardado con éxito", {
        position: "top-center",
      });
      onHide();
    },
  });

  const filteredArticulos = articulos.filter((articulo) =>
    articulo.nomArt.toLowerCase().includes(articuloSearch.toLowerCase())
  );

  return (
    <div>
      {modalTypeProvArt === ModalType.DELETE ? (
        <Modal
          show={showModalProvArti}
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
          show={showModalProvArti}
          onHide={onHide}
          centered
          backdrop="static"
          className="modal-xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>{titleProvArt}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={formik.handleSubmit}>
            <Modal.Body>
              <Form.Group controlId="formDemoraEntrega">
                <Form.Label>Demora de Entrega</Form.Label>
                <Form.Control
                  name="demoraEntrega"
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
                <Form.Label>Costo Unitario</Form.Label>
                <Form.Control
                  name="costoUnitario"
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
                <Form.Label>Costo de Mantenimiento</Form.Label>
                <Form.Control
                  name="costoMantenimiento"
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

              <Form.Group controlId="formCantidadAPedir">
                <Form.Label>Cantidad a Pedir</Form.Label>
                <Form.Control
                  name="cantidadAPedir"
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
                <Form.Label>Período de Revisión</Form.Label>
                <Form.Control
                  name="periodoRevision"
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

              <Form.Group controlId="formTipoLote">
                <Form.Label>Tipo de Lote</Form.Label>
                <Form.Control
                  as="select"
                  name="TipoLote"
                  value={formik.values.TipoLote || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(formik.errors.TipoLote && formik.touched.TipoLote)
                  }
                >
                  <option value="">Seleccione un tipo de lote</option>
                  <option value="LOTEFIJO">Lote Fijo</option>
                  <option value="LOTEVARIABLE">Lote Variable</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.TipoLote}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formArticuloSearch">
                <Form.Label>Buscar Artículo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Buscar artículo..."
                  value={articuloSearch}
                  onChange={(e) => setArticuloSearch(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formArticuloElegido">
                <Form.Label>Artículo</Form.Label>
                <Form.Control
                  as="select"
                  name="articuloDTO.id"
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
                  <option value="">Seleccione un artículo</option>
                  {filteredArticulos.map((articulo) => (
                    <option key={articulo.id} value={articulo.id}>
                      {articulo.nomArt}
                    </option>
                  ))}
                </Form.Control>
                {formik.errors.articuloDTO && formik.touched.articuloDTO && (
                  <div style={{ color: "red" }}>Error en el artículo</div>
                )}
              </Form.Group>
            </Modal.Body>
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
        </Modal>
      )}
    </div>
  );
};

export default ProveedorArticuloAtributoModal;
