import type { ArticuloOCDTO } from "./ArticuloOCDTO";
import type { TipoLote } from "./TipoLote";

export interface ProveedorArticuloDTO {
    id: number;
    fechaHoraBajaArtProv: string; // Usamos string para representar la fecha en formato ISO
    costoGeneralInventario: number; 
    demoraEntrega: number;//carga
    nivelDeServicio: number;//carga
    costoUnitario: number;//carga
    costoPedido: number;//carga
    costoMantenimiento: number;//carga
    loteOptimo: number;
    puntoPedido: number;
    cantidadAPedir: number;
    inventarioMaximo: number;
    periodoRevision: number;//se carga
    TipoLote: TipoLote; // Se carga
    articuloDTO: ArticuloOCDTO;
}