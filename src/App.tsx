import { BrowserRouter } from "react-router-dom";
import Header from "./Header";
import Aplicacion from "./routes/AppRoutes";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { Suspense } from "react";
import Loader from "./components/Loader/Loader";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="toast-modern"
        />
        <Header />
        <main className="main-content">
          <Container fluid className="content-container">
            <Suspense fallback={<Loader text="Cargando aplicación..." variant="fullscreen" />}>
              <Aplicacion />
            </Suspense>
          </Container>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
