import type { ArticuloDTO } from "./ArticuloDTO";
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
    tipoLote: TipoLote; // Se carga - cambiado a minúscula para coincidir con el backend
    articuloDTO: ArticuloDTO;
}