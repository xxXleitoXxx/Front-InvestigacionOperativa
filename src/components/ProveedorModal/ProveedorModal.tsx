import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Row, Col, Card } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { ProveedorService } from "../../services/ProveedorService";
import { ArticuloService } from "../../services/ArticuloSevice";
import type { ProveedorDTO } from "../../types/ProveedorDTO";
import type { ProveedorArticuloDTO } from "../../types/ProveedorArticuloDTO";
import type { ArticuloDTO } from "../../types/ArticuloDTO";
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
  const [proveedorArticulos, setProveedorArticulos] = useState<
    ProveedorArticuloDTO[]
  >(prov.proveedorArticulos || []);
  
  const [articulos, setArticulos] = useState<ArticuloDTO[]>([]);
  const [isLoadingArticulos, setIsLoadingArticulos] = useState(false);

  // Cargar artículos disponibles
  useEffect(() => {
    const fetchArticulos = async () => {
      setIsLoadingArticulos(true);
      try {
        const articulosData = await ArticuloService.getArticulos();
        setArticulos(articulosData);
      } catch (error) {
        console.error("Error al cargar artículos:", error);
        toast.error("Error al cargar la lista de artículos");
      } finally {
        setIsLoadingArticulos(false);
      }
    };

    if (show) {
      fetchArticulos();
    }
  }, [show]);

  const createNewProveedorArticulo = (): ProveedorArticuloDTO => {
    return {
      id: 0,
      fechaHoraBajaArtProv: "",
      costoGeneralInventario: 0,
      demoraEntrega: 0,
      nivelDeServicio: 95, // Valor por defecto
      costoUnitario: 0,
      costoPedido: 0,
      costoMantenimiento: 0,
      loteOptimo: 0,
      puntoPedido: 0,
      cantidadAPedir: 0,
      inventarioMaximo: 0,
      periodoRevision: 0,
      TipoLote: TipoLote.LOTEFIJO,
      articuloDTO: {
        id: 0,
        codArt: "",
        nomArt: "",
        precioVenta: 0,
        descripcionArt: "",
        fechaHoraBajaArt: "",
        stock: 0,
        stockSeguridad: 0,
        demandaDiaria: 0,
        desviacionEstandarUsoPeriodoEntrega: 0,
        desviacionEstandarDurantePeriodoRevisionEntrega: 0,
        proveedorDTO: null,
      },
    };
  };

  const addProveedorArticulo = () => {
    setProveedorArticulos([...proveedorArticulos, createNewProveedorArticulo()]);
  };

  const removeProveedorArticulo = (index: number) => {
    const newArticulos = proveedorArticulos.filter((_, i) => i !== index);
    setProveedorArticulos(newArticulos);
  };

  const updateProveedorArticulo = (index: number, field: keyof ProveedorArticuloDTO, value: any) => {
    const newArticulos = [...proveedorArticulos];
    newArticulos[index] = { ...newArticulos[index], [field]: value };
    setProveedorArticulos(newArticulos);
  };

  const updateArticuloDTO = (index: number, field: keyof ArticuloDTO, value: any) => {
    const newArticulos = [...proveedorArticulos];
    newArticulos[index] = { 
      ...newArticulos[index], 
      articuloDTO: { ...newArticulos[index].articuloDTO, [field]: value }
    };
    setProveedorArticulos(newArticulos);
  };

  const handleSaveUpdate = async (proveedor: ProveedorDTO) => {
    try {
      // Mapeo la estructura de proveedorArticulos
      const proveedorArticulosMapped = proveedorArticulos.map((art) => ({
        id: typeof art.id === 'number' ? art.id : 0,
        fechaHoraBajaArtProv: "",
        costoGeneralInventario: art.costoGeneralInventario,
        demoraEntrega: art.demoraEntrega,
        nivelDeServicio: art.nivelDeServicio,
        costoUnitario: art.costoUnitario,
        costoPedido: art.costoPedido,
        costoMantenimiento: art.costoMantenimiento,
        loteOptimo: art.loteOptimo,
        puntoPedido: art.puntoPedido,
        cantidadAPedir: art.cantidadAPedir,
        inventarioMaximo: art.inventarioMaximo,
        periodoRevision: art.periodoRevision,
        tipoLote: art.TipoLote, // Solo esta propiedad
        articuloDTO: {
          id: art.articuloDTO.id
        }
      }));

      // Estructura final para enviar
      const datosAEnviar = {
        id: typeof proveedor.id === 'number' ? proveedor.id : 0,
        codProv: proveedor.codProv,
        nomProv: proveedor.nomProv,
        descripcionProv: proveedor.descripcionProv,
        fechaHoraBajaProv: "",
        proveedorArticulos: proveedorArticulosMapped
      };

      console.log("[DEBUG] Datos enviados a ProveedorService:", JSON.stringify(datosAEnviar, null, 2));
      const isNew = proveedor.id === 0;
      if (isNew) {
        await ProveedorService.createProveedor(datosAEnviar as any);
      } else {
        await ProveedorService.updateProveedor(datosAEnviar as any);
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
      console.error("Error al guardar proveedor:", error);
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

  const formik = useFormik({
    initialValues: {
      ...prov,
      proveedorArticulos: proveedorArticulos,
    },
    validationSchema: validationSchema,
    onSubmit: handleSaveUpdate,
  });

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
          size="xl"
          className="modal-xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <Form onSubmit={formik.handleSubmit}>
              {/* Información del Proveedor */}
              <Card className="mb-4">
                <Card.Header>
                  <h5>Información del Proveedor</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="formCodProv" className="mb-3">
                        <Form.Label>Código del Proveedor *</Form.Label>
                        <Form.Control
                          name="codProv"
                          type="text"
                          value={formik.values.codProv || ""}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={!!(formik.touched.codProv && formik.errors.codProv)}
                          disabled={modalType !== ModalType.CREATE}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.codProv}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="formNomProv" className="mb-3">
                        <Form.Label>Nombre del Proveedor *</Form.Label>
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
                    </Col>
                  </Row>
                  <Form.Group controlId="formDescripcionProv" className="mb-3">
                    <Form.Label>Descripción del Proveedor</Form.Label>
                    <Form.Control
                      name="descripcionProv"
                      as="textarea"
                      rows={3}
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
                </Card.Body>
              </Card>

              {/* Artículos del Proveedor */}
              <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5>Artículos del Proveedor</h5>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={addProveedorArticulo}
                  >
                    + Agregar Artículo
                  </Button>
                </Card.Header>
                <Card.Body>
                  {proveedorArticulos.length === 0 ? (
                    <p className="text-muted text-center">
                      No hay artículos agregados. Haga clic en "Agregar Artículo" para comenzar.
                    </p>
                  ) : (
                    proveedorArticulos.map((articulo, index) => (
                      <Card key={index} className="mb-3 border-primary">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                          <h6>Artículo {index + 1}</h6>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeProveedorArticulo(index)}
                          >
                            Eliminar
                          </Button>
                        </Card.Header>
                        <Card.Body>
                          {/* Selector de Artículo */}
                          <Row className="mb-3">
                            <Col md={12}>
                              <Form.Group>
                                <Form.Label>Seleccionar Artículo *</Form.Label>
                                <Form.Select
                                  value={articulo.articuloDTO.id !== 0 ? articulo.articuloDTO.id : ""}
                                  onChange={(e) => {
                                    const selectedArticulo = articulos.find(a => a.id === parseInt(e.target.value));
                                    if (selectedArticulo) {
                                      const newArticulos = [...proveedorArticulos];
                                      newArticulos[index] = {
                                        ...newArticulos[index],
                                        articuloDTO: selectedArticulo
                                      };
                                      setProveedorArticulos(newArticulos);
                                    }
                                  }}
                                  disabled={isLoadingArticulos}
                                >
                                  <option value="">Seleccione un artículo...</option>
                                  {articulos.map((art) => (
                                    <option key={art.id} value={art.id}>
                                      {art.codArt} - {art.nomArt}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Costo General de Inventario</Form.Label>
                                <Form.Control
                                  type="number"
                                  step="0.01"
                                  value={articulo.costoGeneralInventario}
                                  readOnly
                                  className="bg-secondary-subtle text-muted"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Demora de Entrega (días)</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={articulo.demoraEntrega}
                                  onChange={(e) => updateProveedorArticulo(index, 'demoraEntrega', parseInt(e.target.value) || 0)}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Nivel de Servicio (%)</Form.Label>
                                <Form.Select
                                  value={articulo.nivelDeServicio}
                                  onChange={(e) => updateProveedorArticulo(index, 'nivelDeServicio', parseInt(e.target.value) || 95)}
                                >
                                  <option value={85}>85%</option>
                                  <option value={95}>95%</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Costo Unitario</Form.Label>
                                <Form.Control
                                  type="number"
                                  step="0.01"
                                  value={articulo.costoUnitario}
                                  onChange={(e) => updateProveedorArticulo(index, 'costoUnitario', parseFloat(e.target.value) || 0)}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Costo de Pedido</Form.Label>
                                <Form.Control
                                  type="number"
                                  step="0.01"
                                  value={articulo.costoPedido}
                                  onChange={(e) => updateProveedorArticulo(index, 'costoPedido', parseFloat(e.target.value) || 0)}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Costo de Mantenimiento</Form.Label>
                                <Form.Control
                                  type="number"
                                  step="0.01"
                                  value={articulo.costoMantenimiento}
                                  onChange={(e) => updateProveedorArticulo(index, 'costoMantenimiento', parseFloat(e.target.value) || 0)}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Lote Óptimo</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={articulo.loteOptimo}
                                  readOnly
                                  className="bg-secondary-subtle text-muted"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Punto de Pedido</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={articulo.puntoPedido}
                                  readOnly
                                  className="bg-secondary-subtle text-muted"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Cantidad a Pedir</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={articulo.cantidadAPedir}
                                  readOnly
                                  className="bg-secondary-subtle text-muted"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Inventario Máximo</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={articulo.inventarioMaximo}
                                  readOnly
                                  className="bg-secondary-subtle text-muted"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Período de Revisión (días)</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={articulo.periodoRevision}
                                  onChange={(e) => updateProveedorArticulo(index, 'periodoRevision', parseInt(e.target.value) || 0)}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Tipo de Lote</Form.Label>
                                <Form.Select
                                  value={articulo.TipoLote}
                                  onChange={(e) => updateProveedorArticulo(index, 'TipoLote', e.target.value as TipoLote)}
                                >
                                  <option value={TipoLote.LOTEFIJO}>Lote Fijo</option>
                                  <option value={TipoLote.PERIODOFIJO}>Período Fijo</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))
                  )}
                </Card.Body>
              </Card>

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

export default ProveedorModal;
