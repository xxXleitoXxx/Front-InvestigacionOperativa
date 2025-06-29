import type { ArticuloOCDTO } from "./ArticuloOCDTO";
import type { EstadoOrdenCompraDTO } from "./EstadoOrdenCompraDTO";
import type { ProveedorOCDTO } from "./ProveedorOCDTO";

export interface OrdenCompraDTO {
  id: number;
  articuloDTO: ArticuloOCDTO;
  estadoOrdenCompraDTO: EstadoOrdenCompraDTO;
  cantPedida: number;
  proveedorDTO: ProveedorOCDTO;
  montoTotal: number;
  fechaPedidoOrdCom: string; // LocalDateTime → string ISO
  fechaLlegadaOrdCom: string;
}
