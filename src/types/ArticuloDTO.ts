import type { ProveedorDTO } from "./ProveedorDTO";


export interface ArticuloDTO {
    id: number;
    codArt: string;
    nomArt: string;
    precioVenta: number;
    descripcionArt: string;
    fechaHoraBajaArt: string; // Usamos string para representar la fecha en formato ISO
    stock: number;
    stockSeguridad: number;
    demandaDiaria: number;
    desviacionEstandarUsoPeriodoEntrega: number;
    desviacionEstandarDurantePeriodoRevisionEntrega: number;
    proveedorDTO?: ProveedorDTO|null;
}