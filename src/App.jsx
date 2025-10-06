import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ParcelasPage from "./pages/ParcelasPage";
import DashboardPage from "./pages/DashboardPage";
import GestionParcelasPage from "./pages/GestionParcelasPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/parcelas" element={<ParcelasPage />} />
        <Route path="/gestion-parcelas" element={<GestionParcelasPage />} />
      </Routes>
    </Router>
  );
}

export default App;
