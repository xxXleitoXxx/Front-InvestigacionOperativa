import type { ArticuloDTO } from "../types/ArticuloDTO";
import type { VentaDTO } from "../types/VentaDto";

const BASE_URL = 'http://localhost:8080';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `Error: ${response.statusText}`;
    try {
      const errorData = await response.json();
      // Asumiendo que el error tiene un formato como { error: "Mensaje de error" }
      errorMessage = errorData.error || JSON.stringify(errorData);
    } catch (error) {
      console.error("Error parsing error response:", error);
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

export const VentaService = {
  getVentas: async (): Promise<VentaDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}/Venta/get`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
  createVentas: async (venta: VentaDTO): Promise<ArticuloDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/Venta/vent`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(venta)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
};
