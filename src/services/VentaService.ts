import type { ArticuloDTO } from "../types/ArticuloDTO";
import type { VentaDTO } from "../types/VentaDto";

const BASE_URL = 'http://localhost:8080';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `Error: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || JSON.stringify(errorData);
    } catch (error) {
      console.error("Error parsing error response:", error);
    }
    throw new Error(errorMessage);
  }
  
  // Obtener el texto de la respuesta
  const responseText = await response.text();
  
  // Si la respuesta está vacía, devolver un array vacío
  if (!responseText || responseText.trim() === '') {
    return [];
  }
  
  // Intentar parsear como JSON
  try {
    const parsed = JSON.parse(responseText);
    
    // Si la respuesta es un array, devolverlo directamente
    if (Array.isArray(parsed)) {
      return parsed;
    }
    
    // Si es un objeto, buscar arrays dentro de él
    if (parsed && typeof parsed === 'object') {
      for (const key in parsed) {
        if (Array.isArray(parsed[key])) {
          return parsed[key];
        }
      }
    }
    
    // Si no encontramos un array, devolver el objeto como está
    return parsed;
  } catch (error) {
    console.error("Error parsing JSON:", error);
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