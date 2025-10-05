import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ParcelasPage from "./pages/ParcelasPage";

function App() {
  return (
    <Router>
      <nav className="bg-gray-800 p-4 text-white flex justify-center gap-4">
        <Link to="/" className="hover:underline">Inicio</Link>
        <Link to="/parcelas" className="hover:underline">Parcelas</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1 className="text-center mt-10 text-2xl">Bienvenido</h1>} />
        <Route path="/parcelas" element={<ParcelasPage />} />
      </Routes>
    </Router>
  );
}

export default App;
