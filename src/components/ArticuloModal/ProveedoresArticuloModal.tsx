import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { ArticuloService } from "../../services/ArticuloSevice";
import type { ArticuloDTO } from "../../types/ArticuloDTO";
import type { ArticuloProvDTO } from "../../types/ArticuloProvDTO";

type ProveedoresArticuloModalProps = {
  show: boolean;
  onHide: () => void;
  articulo: ArticuloDTO;
};

const ProveedoresArticuloModal = ({
  show,
  onHide,
  articulo,
}: ProveedoresArticuloModalProps) => {
  const [proveedores, setProveedores] = useState<ArticuloProvDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show && articulo) {
      fetchProveedores();
    }
  }, [show, articulo]);

  const fetchProveedores = async () => {
    setIsLoading(true);
    try {
      console.log("[DEBUG] Enviando artículo al backend:", JSON.stringify(articulo, null, 2));
      const proveedoresData = await ArticuloService.listarProveedoresPorArticulo(articulo);
      console.log("[DEBUG] Proveedores recibidos del backend:", proveedoresData);
      setProveedores(proveedoresData);
    } catch (error) {
      console.error("Error al cargar proveedores del artículo:", error);
      toast.error("Error al cargar los proveedores del artículo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Proveedores del Artículo: {articulo.nomArt}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
            <p className="mt-2">Cargando proveedores...</p>
          </div>
        ) : proveedores.length === 0 ? (
          <p className="text-center text-muted">
            No se encontraron proveedores para este artículo.
          </p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre del Proveedor</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((proveedor) => (
                <tr key={proveedor.id}>
                  <td>{proveedor.id}</td>
                  <td>{proveedor.nomProv}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProveedoresArticuloModal; 