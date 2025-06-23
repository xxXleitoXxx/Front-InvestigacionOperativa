import type { VentaArticuloDTO } from "./VentaArticuloDTO";

export interface VentaDTO {
  id: number;
  fechaHoraVentDTO: string; // ISO date string, ej: "2025-06-22T20:00:00"
  montoTotalVentDTO: number;
  ventaArticuloDTOS: VentaArticuloDTO[];
}