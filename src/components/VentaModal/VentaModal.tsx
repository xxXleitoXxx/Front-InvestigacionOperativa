import React, { useEffect, useState } from "react";
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
import type { VentaDTO } from "../../types/VentaDto";
import type { VentaArticuloDTO } from "../../types/VentaArticuloDTO";
import { VentaService } from "../../services/VentaService";
import { ArticuloService } from "../../services/ArticuloSevice";
import type { ArticuloDTO } from "../../types/ArticuloDTO";

type VentaModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  vent: VentaDTO;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const VentaModal = ({
  show,
  onHide,
  title,
  modalType,
  vent,
  refreshData,
}: VentaModalProps) => {

    const [articulos, setArticulos] = useState<ArticuloDTO[]>([]);
      const [articuloSearch, setArticuloSearch] = useState("");
       const [selectedArticulo, setSelectedArticulo] = useState<ArticuloDTO | null>(null);

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
      
  const [showVentaArticuloMOdal, setShowVentaArticuloModal] =
    useState(false);
  const [ventaArticulos, setVentaArticulos] = useState<
    VentaArticuloDTO[]
  >(vent.ventaArticuloDTOS || []);

  const initializableNewVentaArticuloDTO = (): VentaArticuloDTO => {
    return {
    id: 0,
    articuloDTO: { id: 0 },
    cantArtVentDTO: 0,
    montoArt: 0
};
  };

  const handleSaveUpdate = async (venta: VentaDTO) => {
    try {
      const isNew = vent.id === 0;
      
      // Calcular el monto total basado en los artículos de la venta
      const montoTotal = formik.values.ventaArticuloDTOS.reduce((total, articulo) => {
        return total + articulo.montoArt;
      }, 0);
      
      // Actualizar el monto total en el formulario
      formik.setFieldValue('montoTotalVentDTO', montoTotal);
      
      // Crear el objeto de venta con los datos actualizados
      // Remover el id de los artículos de la venta ya que el backend no lo recibe
      const ventaArticulosSinId = formik.values.ventaArticuloDTOS.map(({ id, ...articulo }) => articulo);
      
      // Debug: ver qué artId se está enviando
      console.log('Venta a enviar:', {
        ...vent,
        ...formik.values,
        montoTotalVentDTO: montoTotal,
        ventaArticuloDTOS: ventaArticulosSinId
      });
      
      const ventaToSave = {
        ...vent,
        ...formik.values,
        montoTotalVentDTO: montoTotal,
        ventaArticuloDTOS: ventaArticulosSinId as any
      };
      
      if (isNew) {
        await VentaService.createVentas(ventaToSave);
      } 
      toast.success(
        isNew
          ? "Venta creado con éxito"
          : "Venta actualizado con éxito",
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

  

  const validationSchema = Yup.object().shape({
    id: Yup.number().integer().min(0),
  });

 const formik = useFormik({
    initialValues: {
        fechaHoraVentDTO: vent.fechaHoraVentDTO || "",
        montoTotalVentDTO: vent.montoTotalVentDTO || 0,
        ventaArticuloDTOS: vent.ventaArticuloDTOS && vent.ventaArticuloDTOS.length > 0 
            ? vent.ventaArticuloDTOS.map(item => ({
                id: item.id,
                articuloDTO: { id: (item as any).artId || (item as any).articuloDTO?.id || 0 },
                cantArtVentDTO: (item as any).cantArtVent || (item as any).cantArtVentDTO || 0,
                montoArt: item.montoArt
              }))
            : [{
                articuloDTO: { id: 0 },
                cantArtVentDTO: 0,
                montoArt: 0,
                id: 0
            }],
        id: vent.id || 0
    },
    validationSchema: validationSchema,
    onSubmit: handleSaveUpdate,
  });

  const handleSaveProveedorArticulo = (
    ventaArticulo: VentaArticuloDTO
  ) => {
    setVentaArticulos([...ventaArticulos, ventaArticulo]);
  };
    const filteredArticulos = articulos.filter((articulo) =>
    articulo.nomArt.toLowerCase().includes(articuloSearch.toLowerCase())
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
                  name="ventaArticuloDTOS[0].articuloDTO.id"
                  onChange={(e) => {
                    const selectedArticulo = articulos.find(
                      (art) => art.id === Number(e.target.value)
                    );
                    setSelectedArticulo(selectedArticulo || null);
                    
                    // Actualizar el artId en el formulario
                    const artId = Number(e.target.value);
                    formik.setFieldValue('ventaArticuloDTOS[0].articuloDTO.id', artId);
                    console.log('Artículo seleccionado:', selectedArticulo, 'artId asignado:', artId);
                    
                    // Calcular el monto del artículo si hay cantidad
                    if (selectedArticulo && formik.values.ventaArticuloDTOS[0].cantArtVentDTO > 0) {
                      const montoArt = selectedArticulo.precioVenta * formik.values.ventaArticuloDTOS[0].cantArtVentDTO;
                      formik.setFieldValue('ventaArticuloDTOS[0].montoArt', montoArt);
                    }
                  }}
                  value={formik.values.ventaArticuloDTOS[0].articuloDTO.id || ""}
                >
                  <option value="">Seleccione un artículo</option>
                  {filteredArticulos.map((articulo) => (
                    <option key={articulo.id} value={articulo.id}>
                      {articulo.nomArt} - ${articulo.precioVenta}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
    
              {/* 3. Cantidad */}
              <Form.Group>
            <Form.Label>Cantidad a pedir</Form.Label>
            <Form.Control
              type="number"
              name="ventaArticuloDTOS[0].cantArtVentDTO"
              value={formik.values.ventaArticuloDTOS[0].cantArtVentDTO}
              onChange={(e) => {
                const cantidad = Number(e.target.value);
                formik.setFieldValue('ventaArticuloDTOS[0].cantArtVentDTO', cantidad);
                
                // Calcular el monto del artículo si hay artículo seleccionado
                if (selectedArticulo && cantidad > 0) {
                  const montoArt = selectedArticulo.precioVenta * cantidad;
                  formik.setFieldValue('ventaArticuloDTOS[0].montoArt', montoArt);
                }
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.ventaArticuloDTOS && formik.errors.ventaArticuloDTOS && 
             typeof formik.errors.ventaArticuloDTOS === 'string' ? (
              <div className="text-danger">{formik.errors.ventaArticuloDTOS}</div>
            ) : null}
          </Form.Group>
          
          {/* 4. Mostrar monto del artículo */}
          {formik.values.ventaArticuloDTOS[0].montoArt > 0 && (
            <Form.Group>
              <Form.Label>Monto del artículo</Form.Label>
              <Form.Control
                type="text"
                value={`$${formik.values.ventaArticuloDTOS[0].montoArt}`}
                readOnly
              />
            </Form.Group>
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
  );
};

export default VentaModal;
