import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { ProveedorService } from "../../services/ProveedorService";
import type { ProveedorDTO } from "../../types/ProveedorDTO";
import type { ArticuloDTO } from "../../types/ArticuloDTO";

type ArticulosProveedorModalProps = {
  show: boolean;
  onHide: () => void;
  proveedor: ProveedorDTO;
};

const ArticulosProveedorModal = ({
  show,
  onHide,
  proveedor,
}: ArticulosProveedorModalProps) => {
  const [articulos, setArticulos] = useState<ArticuloDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show && proveedor) {
      fetchArticulos();
    }
  }, [show, proveedor]);

  const fetchArticulos = async () => {
    setIsLoading(true);
    try {
      console.log("[DEBUG] Enviando proveedor al backend:", JSON.stringify(proveedor, null, 2));
      const articulosData = await ProveedorService.listarArticulosPorProveedor(proveedor);
      console.log("[DEBUG] Artículos recibidos del backend:", articulosData);
      setArticulos(articulosData);
    } catch (error) {
      console.error("Error al cargar artículos del proveedor:", error);
      toast.error("Error al cargar los artículos del proveedor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Artículos del Proveedor: {proveedor.nomProv}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
            <p className="mt-2">Cargando artículos...</p>
          </div>
        ) : articulos.length === 0 ? (
          <p className="text-center text-muted">
            No se encontraron artículos para este proveedor.
          </p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Precio de Venta</th>
                <th>Stock</th>
                <th>Stock Seguridad</th>
                <th>Descripción</th>
                <th>Predeterminado</th>
              </tr>
            </thead>
            <tbody>
              {articulos.map((articulo) => (
                <tr key={articulo.id}>
                  <td>{articulo.codArt}</td>
                  <td>{articulo.nomArt}</td>
                  <td>${articulo.precioVenta?.toFixed(2) || '0.00'}</td>
                  <td>{articulo.stock}</td>
                  <td>{articulo.stockSeguridad}</td>
                  <td>{articulo.descripcionArt}</td>
                  <td>
                    {articulo.proveedorDTO && articulo.proveedorDTO.id === proveedor.id ? (
                      <span className="text-success fw-bold">Predeterminado</span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
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

export default ArticulosProveedorModal; 