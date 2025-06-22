import type { ArticuloDTO } from "./ArticuloDTO";
import type { TipoLote } from "./TipoLote";

export interface ProveedorArticuloDTO {
    id: number;
    fechaHoraBajaArtProv: string; // Usamos string para representar la fecha en formato ISO
    costoGeneralInventario: number;
    demoraEntrega: number;
    nivelDeServicio: number;
    costoUnitario: number;
    costoPedido: number;
    costoMantenimiento: number;
    loteOptimo: number;
    puntoPedido: number;
    cantidadAPedir: number;
    inventarioMaximo: number;
    periodoRevision: number;
    TipoLote: TipoLote; // Asumiendo que TipoLote es un enum que debes definir en TypeScript
    articuloDTO: ArticuloDTO;
}