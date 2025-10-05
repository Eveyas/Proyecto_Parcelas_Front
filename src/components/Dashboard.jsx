import Temperatura from '../graficas/Temperatura';
import Humedad from '../graficas/Humedad';
import Distribucion from '../graficas/Distribucion';
import MapaParcelas from './MapaParcelas';
import '../styles/dashboard.css';

const Dashboard = () => {
  // Mock data - replace with actual API calls
  const sensorData = {
    temperatura: [
      { hora: '08:00', valor: 22 },
      { hora: '10:00', valor: 25 },
      { hora: '12:00', valor: 28 },
      { hora: '14:00', valor: 30 },
      { hora: '16:00', valor: 26 },
    ],
    humedad: [
      { dia: 'Lun', valor: 65 },
      { dia: 'Mar', valor: 62 },
      { dia: 'Mié', valor: 58 },
      { dia: 'Jue', valor: 70 },
      { dia: 'Vie', valor: 68 },
    ],
    distribucion: [
      { cultivo: 'Maíz', area: 35 },
      { cultivo: 'Trigo', area: 25 },
      { cultivo: 'Soja', area: 20 },
      { cultivo: 'Girasol', area: 15 },
      { cultivo: 'Otros', area: 5 },
    ]
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard Agrícola</h1>
        <div className="status-indicators">
          <span className="status active">Sensores: Online</span>
          <span className="status">Última actualización: {new Date().toLocaleTimeString()}</span>
        </div>
      </header>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Temperatura Actual</h3>
          <div className="metric-value">28°C</div>
          <div className="metric-trend positive">+2°C</div>
        </div>
        
        <div className="metric-card">
          <h3>Humedad del Suelo</h3>
          <div className="metric-value">65%</div>
          <div className="metric-trend neutral">Estable</div>
        </div>
        
        <div className="metric-card">
          <h3>Radiación Solar</h3>
          <div className="metric-value">850 W/m²</div>
          <div className="metric-trend positive">Óptima</div>
        </div>
        
        <div className="metric-card">
          <h3>Parcelas Activas</h3>
          <div className="metric-value">12</div>
          <div className="metric-trend">Total</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Temperatura - Últimas 24h</h3>
          <Temperatura data={sensorData.temperatura} />
        </div>
        
        <div className="chart-card">
          <h3>Humedad - Semanal</h3>
          <Humedad data={sensorData.humedad} />
        </div>
        
        <div className="chart-card full-width">
          <h3>Distribución de Cultivos</h3>
          <Distribucion data={sensorData.distribucion} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
