import type { Proveedor } from "../types/Proveedor";

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

export const ProveedorService = {
  getProveedores: async (): Promise<Proveedor[]> => {
    try {
      const response = await fetch(`${BASE_URL}/Proveedor`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getProveedor: async (id: number): Promise<Proveedor> => {
    try {
      const response = await fetch(`${BASE_URL}/Proveedor/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  createProveedor: async (proveedor: Proveedor): Promise<Proveedor> => {
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

  updateProveedor: async (id: number, proveedor: Proveedor): Promise<Proveedor> => {
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

  bajaLogicaProveedor: async (id: number, proveedor: Proveedor): Promise<void> => {
    try {
      proveedor.fechaHoraBajaProv = new Date();
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
  }
};
