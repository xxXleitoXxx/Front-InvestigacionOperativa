import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
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
    ventaArticuloDTOS: Yup.array().of(
      Yup.object().shape({
        articuloDTO: Yup.object().shape({
          id: Yup.number().required("Debe seleccionar un artículo")
        }),
        cantArtVentDTO: Yup.number().min(1, "La cantidad debe ser al menos 1").required("La cantidad es requerida"),
        montoArt: Yup.number().min(0)
      })
    ).test(
      'no-duplicate-articles',
      'No puede haber artículos duplicados',
      function(value) {
        if (!value) return true;
        
        const articuloIds = value
          .map(item => item.articuloDTO?.id)
          .filter(id => id && id !== 0);
        
        const uniqueIds = new Set(articuloIds);
        return uniqueIds.size === articuloIds.length;
      }
    )
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

  const handleAddArticulo = () => {
    setSelectedArticulo(null);
    formik.setFieldValue('ventaArticuloDTOS', [
      ...formik.values.ventaArticuloDTOS,
      {
        articuloDTO: { id: 0 },
        cantArtVentDTO: 0,
        montoArt: 0,
        id: 0
      }
    ]);
  };

  const handleRemoveArticulo = (index: number) => {
    const updated = [...formik.values.ventaArticuloDTOS];
    updated.splice(index, 1);
    formik.setFieldValue('ventaArticuloDTOS', updated);
  };

  // Función para verificar si un artículo ya está seleccionado en otro índice
  const isArticuloAlreadySelected = (articuloId: number, currentIndex: number) => {
    return formik.values.ventaArticuloDTOS.some((ventaArticulo, index) => 
      index !== currentIndex && ventaArticulo.articuloDTO.id === articuloId
    );
  };

  // Función para obtener artículos disponibles (no seleccionados en otros índices)
  const getAvailableArticulos = (currentIndex: number) => {
    return articulos.filter(articulo => 
      !isArticuloAlreadySelected(articulo.id, currentIndex)
    );
  };

  return (
    
        <Modal show={show} onHide={onHide}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={formik.handleSubmit}>
              {/* 1. Filtro de artículo y lista dinámica */}
              {formik.values.ventaArticuloDTOS.map((ventaArticulo, idx) => {
                const selectedArt = articulos.find(
                  (art) => art.id === ventaArticulo.articuloDTO.id
                );
                return (
                  <div key={idx} style={{ border: '1px solid #eee', padding: 10, marginBottom: 10, borderRadius: 6 }}>
                    <Form.Group>
                      <Form.Label>Artículos</Form.Label>
                      <Form.Control
                        as="select"
                        name={`ventaArticuloDTOS[${idx}].articuloDTO.id`}
                        onChange={(e) => {
                          const artId = Number(e.target.value);
                          formik.setFieldValue(`ventaArticuloDTOS[${idx}].articuloDTO.id`, artId);
                          
                          // Validar si el artículo ya está seleccionado en otro índice
                          if (artId !== 0 && isArticuloAlreadySelected(artId, idx)) {
                            toast.error("Este artículo ya está seleccionado en otra línea");
                            formik.setFieldValue(`ventaArticuloDTOS[${idx}].articuloDTO.id`, 0);
                            return;
                          }
                          
                          // Si hay cantidad, recalcula el monto
                          const art = articulos.find((a) => a.id === artId);
                          if (art && ventaArticulo.cantArtVentDTO > 0) {
                            const montoArt = art.precioVenta * ventaArticulo.cantArtVentDTO;
                            formik.setFieldValue(`ventaArticuloDTOS[${idx}].montoArt`, montoArt);
                          }
                        }}
                        value={ventaArticulo.articuloDTO.id || ""}
                      >
                        <option value="">Seleccione un artículo</option>
                        {getAvailableArticulos(idx).map((articulo) => (
                          <option key={articulo.id} value={articulo.id}>
                            {articulo.nomArt} - ${articulo.precioVenta}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Cantidad a pedir</Form.Label>
                      <Form.Control
                        type="number"
                        name={`ventaArticuloDTOS[${idx}].cantArtVentDTO`}
                        value={ventaArticulo.cantArtVentDTO}
                        onChange={(e) => {
                          const cantidad = Number(e.target.value);
                          formik.setFieldValue(`ventaArticuloDTOS[${idx}].cantArtVentDTO`, cantidad);
                          // Si hay artículo seleccionado, recalcula el monto
                          if (selectedArt && cantidad > 0) {
                            const montoArt = selectedArt.precioVenta * cantidad;
                            formik.setFieldValue(`ventaArticuloDTOS[${idx}].montoArt`, montoArt);
                          }
                        }}
                        onBlur={formik.handleBlur}
                      />
                    </Form.Group>
                    {/* Mostrar monto del artículo */}
                    {ventaArticulo.montoArt > 0 && (
                      <Form.Group>
                        <Form.Label>Monto del artículo</Form.Label>
                        <Form.Control
                          type="text"
                          value={`$${ventaArticulo.montoArt}`}
                          readOnly
                        />
                      </Form.Group>
                    )}
                    {/* Botón eliminar artículo */}
                    {formik.values.ventaArticuloDTOS.length > 1 && (
                      <Button variant="danger" size="sm" onClick={() => handleRemoveArticulo(idx)} style={{ marginTop: 8 }}>
                        Eliminar artículo
                      </Button>
                    )}
                  </div>
                );
              })}
              <Button variant="success" onClick={handleAddArticulo} style={{ marginBottom: 12 }}>
                + Agregar otro artículo
              </Button>
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
