import  type { ArticuloDTO } from './ArticuloDTO';
import  type { EstadoOrdenCompraDTO } from './EstadoOrdenCompraDTO';
import type { ProveedorDTO } from './ProveedorDTO';

export interface OrdenCompraDTO {
  find(arg0: (prov: any) => boolean): unknown;
  id: number;
  montototal: number;
  fechaPedida : String;
  articuloDTO: ArticuloDTO |null;
  estadoOrdenCompraDTO: EstadoOrdenCompraDTO |null;
  cantPedida: number;
  proveedorDTO: ProveedorDTO |null;
}
