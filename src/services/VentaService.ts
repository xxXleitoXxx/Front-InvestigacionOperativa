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
  
  // Obtener el texto de la respuesta
  const responseText = await response.text();
  
  // Intentar parsear como JSON, si falla, devolver el texto como está
  try {
    return JSON.parse(responseText);
  } catch (error) {
    // Si no es JSON válido, devolver el texto como respuesta
    console.log("Respuesta del servidor (no JSON):", responseText);
    return { message: responseText };
  }
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
  createVentas: async (venta: VentaDTO): Promise<any> => {
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