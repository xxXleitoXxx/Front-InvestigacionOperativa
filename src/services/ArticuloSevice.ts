import type { Articulo } from "../types/Articulo";

const BASE_URL = 'http://localhost:8080'

export const ArticuloService={
    getArticulos:async():Promise<Articulo[]>=>{ 
    
    const response = await fetch(`${BASE_URL}/Articulo`);
    const data = await response.json();
    return data;
},

getArticulo:async(id:number): Promise<Articulo>=>{
    const response=await fetch(`${BASE_URL}/Articulo/altaArticulo/${id}`);
    const data = await response.json();
    return data;
},
createArticulo:async (articulo:Articulo):Promise<Articulo> => {

    const response = await fetch(`${BASE_URL}/Articulo/altaArticulo`
        ,{
        method: "POST",
        headers:{
            'Content-Type':'application/json'
                    },
                    body:JSON.stringify(articulo)
    });
    const data = await response.json();
    return data;
    
},
updateArticulo:async (id:number,articulo:Articulo):Promise<Articulo> => {

    const response = await fetch(`${BASE_URL}/modificar/${id}`
        ,{
        method: "PUT",
        headers:{
            'Content-Type':'application/json'
                    },
                    body:JSON.stringify(articulo)
    });
    const data = await response.json();
    return data;
    
},deleteArticulo:async (id:number):Promise<void> => {

    const response = await fetch(`${BASE_URL}/Articulo/altaArticulo/${id}`
        ,{
        method: "DELETE",
        
    });
    if(!response.ok){
        throw new Error('Network response was not ok')
    }
      // Si el código de estado es 204, no intentes parsear JSON

    if(response.status === 204){
        return;
    }
      // Si esperas una respuesta con contenido, parsea JSON

    const contentType= response.headers.get('content-type');
    if(contentType && contentType.includes('aplication/json')){
const data = await response.json();
    return data;

    }
    
    
},bajaLogicaArticulo:async (id:number,articulo:Articulo): Promise<void> =>{
     articulo.fechaHoraBajaArt=new Date();
 const response = await fetch(`${BASE_URL}/Articulo/altaArticulo/${id}`
        ,{
        method: "PUT",
        headers:{
            'Content-Type':'application/json'
                    },
                    body:JSON.stringify(articulo)
    });
    const data = await response.json();
    return data;
  }

    }
