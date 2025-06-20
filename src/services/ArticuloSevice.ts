import type { Articulo } from "../types/Articulo";

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

export const ArticuloService = {
  getArticulos: async (): Promise<Articulo[]> => {
    try {
      const response = await fetch(`${BASE_URL}/Articulo`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getArticulo: async (id: number): Promise<Articulo> => {
    try {
      const response = await fetch(`${BASE_URL}/Articulo/altaArticulo/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  createArticulo: async (articulo: Articulo): Promise<Articulo> => {
    try {
      const response = await fetch(`${BASE_URL}/Articulo/altaArticulo`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articulo)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  updateArticulo: async (id: number, articulo: Articulo): Promise<Articulo> => {
    try {
      const response = await fetch(`${BASE_URL}/modificar/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articulo)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  deleteArticulo: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/Articulo/altaArticulo/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = `Error al eliminar el artículo: ${response.statusText}`;
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

  bajaLogicaArticulo: async (id: number, articulo: Articulo): Promise<void> => {
    try {
      articulo.fechaHoraBajaArt = new Date();
      const response = await fetch(`${BASE_URL}/Articulo/altaArticulo/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articulo)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  }
};
