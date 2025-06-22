// ProveedorArticuloModal.tsx
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { TipoLote } from "../../types/TipoLote"; // Asegúrate de que la ruta sea correcta
import type { ProveedorArticuloDTO } from "../../types/ProveedorArticuloDTO";
import type { ArticuloDTO } from "../../types/ArticuloDTO";

type ProveedorArticuloModalProps = {
  show: boolean;
  onHide: () => void;
  articulo: ArticuloDTO | null;
  onSave: (proveedorArticulo: ProveedorArticuloDTO) => void;
};

const ProveedorArticuloModal = ({
  show,
  onHide,
  articulo,
  onSave,
}: ProveedorArticuloModalProps) => {
  const [proveedorArticulo, setProveedorArticulo] =
    useState<ProveedorArticuloDTO>({
      id: Date.now(),
      fechaHoraBajaArtProv: "",
      costoGeneralInventario: 0,
      demoraEntrega: 0,
      nivelDeServicio: 0,
      costoUnitario: 0,
      costoPedido: 0,
      costoMantenimiento: 0,
      loteOptimo: 0,
      puntoPedido: 0,
      cantidadAPedir: 0,
      inventarioMaximo: 0,
      periodoRevision: 0,
      TipoLote: TipoLote.LOTEFIJO, // Usa el enum correctamente
      articuloDTO: articulo || {
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
        proveedorDTO: {
          id: 0,
          codProv: "",
          nomProv: "",
          descripcionProv: "",
          fechaHoraBajaProv: "",
          proveedorArticulos: [],
        },
      },
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProveedorArticulo({ ...proveedorArticulo, [name]: value });
  };

  const handleSubmit = () => {
    onSave(proveedorArticulo);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Artículo del Proveedor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Artículo</Form.Label>
            <Form.Control plaintext readOnly defaultValue={articulo?.nomArt} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Precio</Form.Label>
            <Form.Control
              name="costoUnitario"
              type="number"
              value={proveedorArticulo.costoUnitario}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Demora de Entrega (días)</Form.Label>
            <Form.Control
              name="demoraEntrega"
              type="number"
              value={proveedorArticulo.demoraEntrega}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Costo del Pedido</Form.Label>
            <Form.Control
              name="costoPedido"
              type="number"
              value={proveedorArticulo.costoPedido}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProveedorArticuloModal;
