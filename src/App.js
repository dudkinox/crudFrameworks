import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import axios from "axios";

function App() {
  const baseUrl = "http://supachok-website.000webhostapp.com/API/";
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [frameworkSeleccionado, setFrameworkSeleccionado] = useState({
    id: "",
    nombre: "",
    lanzamiento: "",
    desarrollador: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFrameworkSeleccionado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(frameworkSeleccionado);
  };

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };

  const peticionGet = async () => {
    await axios
      .get(baseUrl)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const peticionPost = async () => {
    var f = new FormData();
    f.append("nombre", frameworkSeleccionado.nombre);
    f.append("lanzamiento", frameworkSeleccionado.lanzamiento);
    f.append("desarrollador", frameworkSeleccionado.desarrollador);
    f.append("METHOD", "POST");
    await axios
      .post(baseUrl, f)
      .then((response) => {
        setData(data.concat(response.data));
        abrirCerrarModalInsertar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const peticionPut = async () => {
    var f = new FormData();
    f.append("nombre", frameworkSeleccionado.nombre);
    f.append("lanzamiento", frameworkSeleccionado.lanzamiento);
    f.append("desarrollador", frameworkSeleccionado.desarrollador);
    f.append("METHOD", "PUT");
    await axios
      .post(baseUrl, f, { params: { id: frameworkSeleccionado.id } })
      .then((response) => {
        var dataNueva = data;
        dataNueva.map((framework) => {
          if (framework.id === frameworkSeleccionado.id) {
            framework.nombre = frameworkSeleccionado.nombre;
            framework.lanzamiento = frameworkSeleccionado.lanzamiento;
            framework.desarrollador = frameworkSeleccionado.desarrollador;
          }
        });
        setData(dataNueva);
        abrirCerrarModalEditar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const peticionDelete = async () => {
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios
      .post(baseUrl, f, { params: { id: frameworkSeleccionado.id } })
      .then((response) => {
        setData(
          data.filter((framework) => framework.id !== frameworkSeleccionado.id)
        );
        abrirCerrarModalEliminar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const seleccionarFramework = (framework, caso) => {
    setFrameworkSeleccionado(framework);

    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  useEffect(() => {
    peticionGet();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <br />
      <button
        className="btn btn-success"
        onClick={() => abrirCerrarModalInsertar()}
      >
        Insertar
      </button>
      <br />
      <br />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Lanzamiento</th>
            <th>Desarrollador</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((framework) => (
            <tr key={framework.id}>
              <td>{framework.id}</td>
              <td>{framework.nombre}</td>
              <td>{framework.lanzamiento}</td>
              <td>{framework.desarrollador}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => seleccionarFramework(framework, "Editar")}
                >
                  Editar
                </button>{" "}
                {"  "}
                <button
                  className="btn btn-danger"
                  onClick={() => seleccionarFramework(framework, "Eliminar")}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Framework</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="nombre"
              onChange={handleChange}
            />
            <br />
            <label>Lanzamiento: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="lanzamiento"
              onChange={handleChange}
            />
            <br />
            <label>Desarrollador: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="desarrollador"
              onChange={handleChange}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => peticionPost()}>
            Insertar
          </button>
          {"   "}
          <button
            className="btn btn-danger"
            onClick={() => abrirCerrarModalInsertar()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Framework</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="nombre"
              onChange={handleChange}
              value={frameworkSeleccionado && frameworkSeleccionado.nombre}
            />
            <br />
            <label>Lanzamiento: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="lanzamiento"
              onChange={handleChange}
              value={frameworkSeleccionado && frameworkSeleccionado.lanzamiento}
            />
            <br />
            <label>Desarrollador: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="desarrollador"
              onChange={handleChange}
              value={
                frameworkSeleccionado && frameworkSeleccionado.desarrollador
              }
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => peticionPut()}>
            Editar
          </button>
          {"   "}
          <button
            className="btn btn-danger"
            onClick={() => abrirCerrarModalEditar()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEliminar}>
        <ModalBody>
          ¿Estás seguro que deseas eliminar el Framework{" "}
          {frameworkSeleccionado && frameworkSeleccionado.nombre}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => peticionDelete()}>
            Sí
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => abrirCerrarModalEliminar()}
          >
            No
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
