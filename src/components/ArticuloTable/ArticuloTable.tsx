import { useEffect, useState } from "react";
import type { Articulo } from "../../types/Articulo";
import { ArticuloService } from "../../services/ArticuloSevice";
import Loader from "../Loader/Loader";
import { Button, Table } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import ArticuloModal from "../ArticuloModal/ArticuloModal";
import { EditButton } from "../EditButton/EditButton";
import { DeleteButton } from "../DeleteButton/DeleteButton";

const ArticuloTable = () => {
  //Const para inicializar un proveedor por defecto y evitar el undefined

  const initializableNewArticulo = (): Articulo => {
    return {
      id: 0,
      codArt: "",
      nomArt: "",
      precioVenta: 0,
      descripcionArt: "",
      fechaHoraBajaArt: null,

      // Atributos para cálculo de inventario
      stock: 0,
      stockSeguridad: 0,
      costoGeneralInventario: 0,

      // Lote fijo
      loteOptimo: 0,
      puntoPedido: 0,

      // Periodo fijo
      inventarioMaximo: 0,
      tipoLote: null, // o algún valor predeterminado si TipoLote tiene una estructura específica

      // Relaciones
      proveedorElegido: null, // o una estructura básica si Proveedor tiene una estructura específica
    };
  };
  //Const para manejar el estado del modal

  const [articulo, setArticulo] = useState<Articulo>(initializableNewArticulo);

  //Const para manejar estado del modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [title, setTitle] = useState("");

  //Logica del Modal

  const handleClick = (newTitle: string, art: Articulo, modal: ModalType) => {
    setTitle(newTitle);
    setModalType(modal);
    setArticulo(art);
    setShowModal(true);
  };

  //Variable que va a contener los datos recibido de la api
  const [articulos, setArticulos] = useState<Articulo[]>([]);

  const [isLoading, setIsloading] = useState(true);
  //variable que va a actualizar los datos de la tabla luego de cada operacion exitosa
  const [refreshData, setRefreshData] = useState(false);
  //Este hook se va a ejecutar cada vez que se renderice el componente o
  //refresData cambie de estado
  useEffect(() => {
    const fetchArticulos = async () => {
      const articulo = await ArticuloService.getArticulos();
      setArticulos(articulo);
      setIsloading(false);
    };
    fetchArticulos();
  }, [refreshData]);
  //Test, para que este log esta modificado para que se muestre
  console.log(JSON.stringify(articulos));
  return (
    <div>
      <h1>Tabla Articulos</h1>
      <Button
        onClick={() =>
          handleClick(
            "Añadir Articulos",
            initializableNewArticulo(),
            ModalType.CREATE
          )
        }
      >
        Nuevo Articulo
      </Button>
      {isLoading ? (
        <Loader />
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Id</th>
              <th>codArt</th>
              <th>nomArt</th>
              <th>precioVenta</th>
              <th>descripcionArt</th>
              <th>fechaHoraBajaArt</th>
              <th>stock</th>
              <th>stockSeguridad</th>
              <th>costoGeneralInventario</th>
              <th>loteOptimo</th>
              <th>puntoPedido</th>
              <th>inventarioMaximo</th>
              <th>tipoLote</th>
              <th>proveedorElegido</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {articulos.map((art) => (
              <tr key={art.id}>
                <td>{art.id}</td>
                <td>{art.codArt}</td>
                <td>{art.nomArt}</td>
                <td>{art.precioVenta}</td>
                <td>{art.descripcionArt}</td>
                <td>
                  {art.fechaHoraBajaArt ? String(art.fechaHoraBajaArt) : ""}
                </td>
                <td>{art.stock}</td>
                <td>{art.stockSeguridad}</td>
                <td>{art.costoGeneralInventario}</td>
                <td>{art.loteOptimo}</td>
                <td>{art.puntoPedido}</td>
                <td>{art.inventarioMaximo}</td>
                <td>{art.tipoLote ? art.tipoLote : ""}</td>
                <td>
                  {art.proveedorElegido ? art.proveedorElegido.nomProv : ""}
                </td>{" "}
                {/* Asumiendo que `Proveedor` tiene una propiedad `nomProv` */}
                <td>
                  <EditButton
                    onClick={() =>
                      handleClick("Editar artículo", art, ModalType.UPDATE)
                    }
                  />
                </td>
                <td>
                  <DeleteButton
                    onClick={() =>
                      handleClick("Borrar articulo", art, ModalType.DELETE)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {showModal && (
        <ArticuloModal
          show={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          art={articulo}
          title={title}
          refreshData={setRefreshData}
        />
      )}
    </div>
  );
};

export default ArticuloTable;
