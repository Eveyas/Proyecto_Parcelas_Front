import '../styles/dashboard.css';

const MapaParcelas = () => {
  return (
    <div className="mapa-container">
      <div className="mapa-placeholder">
        <p>Mapa de parcelas integrado con Leaflet.js o Google Maps API</p>
        <div className="mapa-overlay">
          {/* Aquí integrarás el mapa real */}
          <span>Visualización de parcelas activas y sensores</span>
        </div>
      </div>
    </div>
  );
};

export default MapaParcelas;
