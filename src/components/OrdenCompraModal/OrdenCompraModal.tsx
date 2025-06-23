import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import type { ModalType } from "../../types/ModalType";
import type { OrdenCompraDTO } from "../../types/OrdenCompraDTO";
import type { ArticuloDTO } from "../../types/ArticuloDTO";
import { OrdenCompraService } from "../../services/OrdenCompraService";
import { ProveedorService } from "../../services/ProveedorService";
import type { ProveedorDTO } from "../../types/ProveedorDTO";
import { ArticuloService } from "../../services/ArticuloSevice";

type OrdenCompraModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  orden: OrdenCompraDTO;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const OrdenCompraModal = ({
  show,
  onHide,
  title,
  modalType,
  orden,
  refreshData,
}: OrdenCompraModalProps) => {
  const [articulos, setArticulos] = useState<ArticuloDTO[]>([]);
  const [articuloSearch, setArticuloSearch] = useState("");
  const [proveedores, setProveedores] = useState<ProveedorDTO[]>([]);
  const [proveedorSearch, setProveedorSearch] = useState("");
  const [selectedArticulo, setSelectedArticulo] = useState<ArticuloDTO | null>(null);
  const [selectedProveedor, setSelectedProveedor] = useState<ProveedorDTO | null>(null);

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

  const handleSaveUpdate = async (orden: OrdenCompraDTO) => {
    try {
      const isNew = orden.id === 0;
      if (isNew) {
        await OrdenCompraService.createOrdenCompra(orden);
      } else {
        await OrdenCompraService.updateOrdenCompra(orden.id, orden);
      }
      toast.success(
        isNew ? "Orden de Compra creada con éxito" : "Orden de Compra actualizada con éxito",
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

  const filteredArticulos = articulos.filter((articulo) =>
    articulo.nomArt.toLowerCase().includes(articuloSearch.toLowerCase())
  );

  const filteredProveedores = proveedores.filter((proveedor) =>
    proveedor.proveedorArticulos.some(
      (pa) => pa.articuloDTO.id === selectedArticulo?.id
    )
  );

  const addArticuloToProveedor = (articulo: ArticuloDTO) => {
    setSelectedArticulo(articulo);
  };

  const validationSchema = Yup.object().shape({
    id: Yup.number().integer().min(0),
    cantPedida: Yup.number().required("La cantidad es requerida").min(1, "La cantidad debe ser al menos 1"),
    articuloDTO: Yup.object().shape({
      id: Yup.number().required("El ID del artículo es requerido"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      ...orden,
      cantPedida: orden.cantPedida || 0,
    },
    validationSchema: validationSchema,
    onSubmit: handleSaveUpdate,
  });

  // Encuentra el proveedorArticulo seleccionado
  const selectedProveedorArticulo = selectedProveedor?.proveedorArticulos.find(
    (pa) => pa.articuloDTO.id === selectedArticulo?.id
  );

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          {/* 1. Filtro de artículo */}
          <Form.Group>
            <Form.Label>Buscar artículo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Buscar artículo..."
              value={articuloSearch}
              onChange={(e) => setArticuloSearch(e.target.value)}
            />
          </Form.Group>

          {/* 2. Select de artículo */}
          <Form.Group>
            <Form.Label>Artículos</Form.Label>
            <Form.Control
              as="select"
              name="articuloDTO.id"
              onChange={(e) => {
                const selectedArticulo = articulos.find(
                  (art) => art.id === Number(e.target.value)
                );
                if (selectedArticulo) {
                  addArticuloToProveedor(selectedArticulo);
                }
              }}
              value={selectedArticulo?.id || ""}
            >
              <option value="">Seleccione un artículo</option>
              {filteredArticulos.map((articulo) => (
                <option key={articulo.id} value={articulo.id}>
                  {articulo.nomArt}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* 3. Cantidad */}
          <Form.Group>
            <Form.Label>Cantidad a pedir</Form.Label>
            <Form.Control
              type="number"
              name="cantPedida"
              value={formik.values.cantPedida}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.cantPedida && formik.errors.cantPedida ? (
              <div className="text-danger">{formik.errors.cantPedida}</div>
            ) : null}
          </Form.Group>

          {/* 4. Proveedor */}
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
                            name="proveedorDTO.id"
                            value={formik.values.proveedorDTO?.id || ""}
                            onChange={(e) => {
                              const selectedProveedor = proveedores.find(
                                (prov) => prov.id === Number(e.target.value)
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
                            {filteredProveedores.map((proveedor) => (
                              <option key={proveedor.id} value={proveedor.id}>
                                {proveedor.nomProv}
                              </option>
                            ))}
                          </Form.Control>
                          {formik.errors.proveedorDTO && formik.touched.proveedorDTO && (
                            <div style={{ color: "red" }}>Error en el proveedor</div>
                          )}
                        </Form.Group>

          {/* 5. Info Extra */}
          <Form.Group>
            <Form.Label>Info del Proveedor</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={
                selectedProveedorArticulo
                  ? `Precio: ${selectedProveedorArticulo.costoUnitario}, Demora: ${selectedProveedorArticulo.demoraEntrega}`
                  : "Seleccione un artículo y un proveedor para ver la información"
              }
              readOnly
            />
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
  );
};

export default OrdenCompraModal;
