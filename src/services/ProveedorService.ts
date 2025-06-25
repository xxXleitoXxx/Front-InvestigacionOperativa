import type { ProveedorDTO } from "../types/ProveedorDTO";

const BASE_URL = 'http://localhost:8080';

const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    let errorMessage = `Error: ${response.statusText}`;

    if (contentType && contentType.includes('application/json')) {
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || JSON.stringify(errorData);
      } catch (error) {
        console.error("Error parsing error response as JSON:", error);
        errorMessage = `Error parsing error response as JSON: ${await response.text()}`;
      }
    } else {
      errorMessage = `Unexpected content type: ${contentType}, Message: ${await response.text()}`;
    }

    throw new Error(errorMessage);
  }

  // Obtener el texto de la respuesta
  const responseText = await response.text();
  
  // Si la respuesta está vacía, devolver un objeto de éxito
  if (!responseText || responseText.trim() === '') {
    console.log("Respuesta vacía del servidor, considerando como éxito");
    return { message: "Operación completada con éxito" };
  }

  if (contentType && contentType.includes('application/json')) {
    try {
      return JSON.parse(responseText);
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      console.log("Respuesta del servidor:", responseText);
      return { message: responseText };
    }
  } else {
    return { message: responseText };
  }
};

export const ProveedorService = {
  getProveedores: async (): Promise<ProveedorDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}/Proveedor`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getProveedor: async (id: number): Promise<ProveedorDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/Proveedor/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  createProveedor: async (proveedor: ProveedorDTO): Promise<ProveedorDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/Proveedor/altaProveedor`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(proveedor)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  updateProveedor: async (proveedor: ProveedorDTO): Promise<ProveedorDTO> => {
    try {
      console.log('Enviando proveedor a actualizar:', JSON.stringify(proveedor, null, 2));
      console.log('URL del endpoint:', `${BASE_URL}/Proveedor/modificarProveedor`);
      
      const response = await fetch(`${BASE_URL}/Proveedor/modificarProveedor`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(proveedor)
      });
      
      console.log('Respuesta del servidor:', response.status, response.statusText);
      console.log('Headers de respuesta:', Object.fromEntries(response.headers.entries()));
      
      return await handleResponse(response);
    } catch (error) {
      console.error("Error detallado en updateProveedor:", error);
      throw error;
    }
  },

  deleteProveedor: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/Proveedor/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = `Error al eliminar el proveedor: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || JSON.stringify(errorData);
        } catch (error) {
          console.error("Error parsing error response:", error);
        }
        throw new Error(errorMessage);
      }

      if (response.status === 204) {
        return;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  bajaLogicaProveedor: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/Proveedor/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  }
};