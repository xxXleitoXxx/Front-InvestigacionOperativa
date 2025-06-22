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

  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return response.text();
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
      const response = await fetch(`${BASE_URL}/Proveedor`, {
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

  updateProveedor: async (id: number, proveedor: ProveedorDTO): Promise<ProveedorDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/Proveedor/${id}`, {
        method: "PUT",
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
