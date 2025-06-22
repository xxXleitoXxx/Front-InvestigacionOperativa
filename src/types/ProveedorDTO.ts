import type { ProveedorArticuloDTO } from "./ProveedorArticuloDTO";

export interface ProveedorDTO {
    id: number;
    codProv: string;
    nomProv: string;
    descripcionProv: string;
    fechaHoraBajaProv: string; // Usamos string para representar la fecha en formato ISO
    proveedorArticulos: ProveedorArticuloDTO[];
}