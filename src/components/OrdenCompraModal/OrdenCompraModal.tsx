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
  handleOrdenPendiente?: (ordenCompra: OrdenCompraDTO) => Promise<void>;
  handleOrdenEnProceso?: (ordenCompra: OrdenCompraDTO) => Promise<void>;
  handleOrdenFinalizada?: (ordenCompra: OrdenCompraDTO) => Promise<void>;
};

const OrdenCompraModal = ({
  show,
  onHide,
  title,
  modalType,
  orden,
  refreshData,
  handleOrdenPendiente,
  handleOrdenEnProceso,
  handleOrdenFinalizada,
}: OrdenCompraModalProps) => {
  const [articulos, setArticulos] = useState<ArticuloDTO[]>([]);
  const [articuloSearch, setArticuloSearch] = useState("");
  const [proveedores, setProveedores] = useState<ProveedorDTO[]>([]);
  const [proveedorSearch, setProveedorSearch] = useState("");
  const [selectedArticulo, setSelectedArticulo] = useState<ArticuloDTO | null>(null);
  const [selectedProveedor, setSelectedProveedor] = useState<ProveedorDTO | null>(null);
  const [isLoadingCantidad, setIsLoadingCantidad] = useState(false);

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

  // Inicializar selectedArticulo y selectedProveedor cuando se abre el modal para editar
  useEffect(() => {
    if (show && orden && orden.articuloDTO && orden.articuloDTO.id && articulos.length > 0) {
      const articuloCompleto = articulos.find(art => art.id === orden.articuloDTO.id);
      if (articuloCompleto) {
        setSelectedArticulo(articuloCompleto);
      }
    }
    if (show && orden && orden.proveedorDTO && orden.proveedorDTO.id && proveedores.length > 0) {
      const proveedorCompleto = proveedores.find(prov => prov.id === orden.proveedorDTO.id);
      if (proveedorCompleto) {
        setSelectedProveedor(proveedorCompleto);
      }
    }
  }, [show, orden, articulos, proveedores]);

  const handleSaveUpdate = async (ordenFormik: OrdenCompraDTO) => {
    try {
      if (!ordenFormik.articuloDTO || !ordenFormik.proveedorDTO) {
        toast.error("Debe seleccionar un artículo y un proveedor.");
        return;
      }

      // Calcular el monto total
      const selectedProveedorArticulo = selectedProveedor?.proveedorArticulos.find(
        (pa) => pa.articuloDTO.id === ordenFormik.articuloDTO?.id
      );
      
      const montoTotal = selectedProveedorArticulo 
        ? selectedProveedorArticulo.costoUnitario * ordenFormik.cantPedida
        : 0;

      let orden;
      const isNew = !ordenFormik.id || ordenFormik.id === 0;
      
      if (isNew) {
        orden = {
          articuloDTO: {
            id: ordenFormik.articuloDTO.id,
            nomArt: ordenFormik.articuloDTO.nomArt,
          },
          estadoOrdenCompraDTO: { id: 1 },
          cantPedida: ordenFormik.cantPedida,
          montototal: montoTotal,
          proveedorDTO: {
            id: ordenFormik.proveedorDTO.id,
            nomProv: ordenFormik.proveedorDTO.nomProv,
          },
          fechaPedidoOrdCom: new Date().toISOString(),
        } as any;
        await OrdenCompraService.createOrdenCompra(orden);
      } else {
        // Para actualizaciones, usar la función específica del estado
        const ordenActualizada = {
          ...ordenFormik,
          articuloDTO: { 
            id: ordenFormik.articuloDTO.id,
            nomArt: ordenFormik.articuloDTO.nomArt,
          },
          montototal: montoTotal,
          proveedorDTO: { id: ordenFormik.proveedorDTO.id },
        } as any;

        // Determinar qué función usar basándose en el estado actual
        const estadoId = ordenFormik.estadoOrdenCompraDTO?.id;
        
        switch (estadoId) {
          case 1: // Pendiente
            if (handleOrdenPendiente) {
              await handleOrdenPendiente(ordenActualizada);
            } else {
              await OrdenCompraService.updateOrdenCompra(ordenFormik.id, ordenActualizada);
            }
            break;
          case 2: // En proceso
            if (handleOrdenEnProceso) {
              await handleOrdenEnProceso(ordenActualizada);
            } else {
              await OrdenCompraService.updateOrdenCompra(ordenFormik.id, ordenActualizada);
            }
            break;
          case 3: // Finalizada
            if (handleOrdenFinalizada) {
              await handleOrdenFinalizada(ordenActualizada);
            } else {
              await OrdenCompraService.updateOrdenCompra(ordenFormik.id, ordenActualizada);
            }
            break;
          default:
            await OrdenCompraService.updateOrdenCompra(ordenFormik.id, ordenActualizada);
        }
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
    articulo.nomArt.toLowerCase().includes(articuloSearch.toLowerCase()) &&
    // Excluir artículos dados de baja
    (!articulo.fechaHoraBajaArt || articulo.fechaHoraBajaArt.trim() === "")
  );

  const filteredProveedores = proveedores.filter((proveedor) =>
    proveedor.proveedorArticulos.some(
      (pa) => pa.articuloDTO.id === selectedArticulo?.id
    ) || 
    // Incluir el proveedor actual cuando se está editando
    (orden.id && orden.proveedorDTO?.id === proveedor.id)
  );

  const addArticuloToProveedor = async (articulo: ArticuloDTO) => {
    setSelectedArticulo(articulo);
    
    // Obtener la cantidad recomendada del backend
    setIsLoadingCantidad(true);
    try {
      console.log("Obteniendo cantidad recomendada para:", articulo);
      
      // Convertir ArticuloDTO a ArticuloOCDTO para el servicio
      const articuloParaServicio = {
        id: articulo.id,
        nomArt: articulo.nomArt
      };
      
      const cantidadRecomendada = await OrdenCompraService.cantRecomendad(articuloParaServicio);
      console.log("Cantidad recomendada recibida:", cantidadRecomendada);
      
      // Extraer la cantidad recomendada de la respuesta
      let cantidad = 0;
      if (cantidadRecomendada && typeof cantidadRecomendada === 'object') {
        console.log("Propiedades de la respuesta:", Object.keys(cantidadRecomendada));
        cantidad = cantidadRecomendada.cantidad || 
                 cantidadRecomendada.cantRecomendada || 
                 cantidadRecomendada.data || 
                 cantidadRecomendada.body || 
                 cantidadRecomendada.message || 
                 0;
      } else if (typeof cantidadRecomendada === 'number') {
        cantidad = cantidadRecomendada;
      }
      
      console.log("Cantidad extraída:", cantidad);
      
      // Actualizar el campo de cantidad en el formulario
      formik.setFieldValue("cantPedida", cantidad);
      console.log("Campo cantPedida actualizado con:", cantidad);
      
    } catch (error) {
      console.error("Error al obtener cantidad recomendada:", error);
      // Si hay error, mantener la cantidad actual o poner 0
      formik.setFieldValue("cantPedida", 0);
    } finally {
      setIsLoadingCantidad(false);
    }
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
                  formik.setFieldValue("articuloDTO", selectedArticulo);
                }
              }}
              value={selectedArticulo?.id?.toString() ?? ""}
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
            <Form.Label>
              Cantidad a pedir 
              {isLoadingCantidad && <span style={{ color: 'blue', marginLeft: '5px' }}>⏳ Cargando cantidad recomendada...</span>}
            </Form.Label>
            <Form.Control
              type="number"
              name="cantPedida"
              value={formik.values.cantPedida}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoadingCantidad}
              placeholder={isLoadingCantidad ? "Cargando..." : "Ingrese la cantidad"}
            />
            {formik.touched.cantPedida && formik.errors.cantPedida ? (
              <div className="text-danger">{formik.errors.cantPedida}</div>
            ) : null}
          </Form.Group>

          {/* 4. Proveedor */}
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
                              setSelectedProveedor(selectedProveedor || null);
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
                                {proveedor.nomProv} {selectedArticulo?.proveedorDTO?.id === proveedor.id ? '🔵' : ''}
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
                selectedProveedorArticulo && formik.values.cantPedida > 0
                  ? `Precio unitario: $${selectedProveedorArticulo.costoUnitario}\nDemora: ${selectedProveedorArticulo.demoraEntrega}\nMonto total: $${(selectedProveedorArticulo.costoUnitario * formik.values.cantPedida).toFixed(2)}`
                  : "Seleccione un artículo, un proveedor y una cantidad para ver la información"
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
