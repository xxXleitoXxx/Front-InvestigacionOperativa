import type { Proveedor } from "./Proveedor";
import type { TipoLote } from "./TipoLote";

export interface Articulo {
    id:number
    codArt: string;
    nomArt: string;
    precioVenta: number;
    descripcionArt: string;
    fechaHoraBajaArt: Date | null; // Puedes usar Date si manejas objetos Date, o string si prefieres formato ISO

    // Atributos para cálculo de inventario
    stock: number;
    stockSeguridad: number;
    costoGeneralInventario: number;

    // Lote fijo
    loteOptimo: number;
    puntoPedido: number;

    // Periodo fijo
    inventarioMaximo: number;
    tipoLote: TipoLote|null; // Asumiendo que TipoLote es un tipo definido en otro lugar

    // Relaciones
    proveedorElegido: Proveedor|null; // Asumiendo que Proveedor es una interfaz definida en otro lugar
}


