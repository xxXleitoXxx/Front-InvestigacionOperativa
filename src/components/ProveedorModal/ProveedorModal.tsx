import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { ProveedorService } from "../../services/ProveedorService";
import type { ProveedorDTO } from "../../types/ProveedorDTO";
import type { ArticuloDTO } from "../../types/ArticuloDTO";
import type { ProveedorArticuloDTO } from "../../types/ProveedorArticuloDTO";
import { ArticuloService } from "../../services/ArticuloSevice";
import ProveedorArticuloModal from "../ProveedorArticuloModal/ProveedorArticuloModal";

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
  const [articulos, setArticulos] = useState<ArticuloDTO[]>([]);
  const [articuloSearch, setArticuloSearch] = useState("");
  const [showArticuloModal, setShowArticuloModal] = useState(false);
  const [selectedArticulo, setSelectedArticulo] = useState<ArticuloDTO | null>(
    null
  );

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
    fechaHoraBajaProv: Yup.date().nullable(),
    proveedorArticulos: Yup.array().of(
      Yup.object().shape({
        precioArtProv: Yup.number().required("El precio es requerido"),
        demoraEntrega: Yup.number().required(
          "La demora de entrega es requerida"
        ),
        costoPedido: Yup.number().required("El costo del pedido es requerido"),
        articuloDTO: Yup.object().shape({
          id: Yup.number().required("El ID del artículo es requerido"),
        }),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      ...prov,
      proveedorArticulos: prov.proveedorArticulos || [],
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: handleSaveUpdate,
  });

  const filteredArticulos = articulos.filter((articulo) =>
    articulo.nomArt.toLowerCase().includes(articuloSearch.toLowerCase())
  );

  const addArticuloToProveedor = (articulo: ArticuloDTO) => {
    setSelectedArticulo(articulo);
    setShowArticuloModal(true);
  };

  const saveProveedorArticulo = (proveedorArticulo: ProveedorArticuloDTO) => {
    formik.setFieldValue("proveedorArticulos", [
      ...formik.values.proveedorArticulos,
      proveedorArticulo,
    ]);
  };

  return (
    <>
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

      <ProveedorArticuloModal
        show={showArticuloModal}
        onHide={() => setShowArticuloModal(false)}
        articulo={selectedArticulo}
        onSave={saveProveedorArticulo}
      />
    </>
  );
};

export default ProveedorModal;
