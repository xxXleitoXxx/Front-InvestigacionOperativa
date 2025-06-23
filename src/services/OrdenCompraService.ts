import type { OrdenCompraDTO } from "../types/OrdenCompraDTO";

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

export const OrdenCompraService = {
  getOrdenCompra: async (): Promise<OrdenCompraDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}/OrdenCompra/get`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getOrdenCompraid: async (id: number): Promise<OrdenCompraDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/OrdenCompra/crearManual/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  createOrdenCompra: async (OrdenCompra: OrdenCompraDTO): Promise<OrdenCompraDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/OrdenCompra/crearManual`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(OrdenCompra)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  cancelarOrdenCompra: async (OrdenCompra: OrdenCompraDTO) : Promise<OrdenCompraDTO> =>{
    try{
        const response = await fetch(`${BASE_URL}/OrdenCompra/cancelar` , {
            method: "PUT",
            headers:{
                'Content-Type': 'application/json'
            },
             body: JSON.stringify(OrdenCompra)
        });
        return await handleResponse(response);
    }
    catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  finalizarOrdenCompra: async (OrdenCompra: OrdenCompraDTO): Promise<OrdenCompraDTO> =>{
    try{
        const response = await fetch(`${BASE_URL}/OrdenCompra/finalizar`,{
            method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(OrdenCompra)
        });
        return await handleResponse(response);
    }catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  crearOCPedidoFijo: async():Promise<any>=>{
    try{
        const response = await fetch(`${BASE_URL}/OrdenCompra/crearPeriodoFijo`,{
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        
      });
        return await handleResponse(response);
    }catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }

  }
,
  updateOrdenCompra: async (id: number, OrdenCompra: OrdenCompraDTO): Promise<OrdenCompraDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/OrdenCompra/mod`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(OrdenCompra)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  deleteOrdenCompra: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/OrdenCompra/${id}`, {
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

   /* bajaLogicaArticulo: async (id: number, articulo: OrdenCompraDTO): Promise<void> => {
    try {
      articulo.fechaHoraBajaArt = new Date().toISOString(); // Asegúrate de convertir la fecha a string ISO
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
  }*/
};
