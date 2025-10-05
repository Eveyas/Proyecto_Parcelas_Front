import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import Dashboard from './components/Dashboard';
import MapaParcelas from './components/MapaParcelas';
import ParcelasEliminadas from './components/ParcelasEliminadas';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/datos-actuales" element={<Dashboard />} />
            <Route path="/graficas" element={<Dashboard />} />
            <Route path="/mapa-parcelas" element={<MapaParcelas />} />
            <Route path="/parcelas-eliminadas" element={<ParcelasEliminadas />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
