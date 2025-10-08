import { useEffect, useState } from 'react';
import { getDataParcelas } from '../modules/getDataParcelas';
import { sensorService } from '../modules/apiService';
import TemperatureChart from '../components/charts/TemperatureChart';
import HumidityChart from '../components/charts/HumidityChart';
import RainChart from '../components/charts/RainChart';
import SolarRadiationChart from '../components/charts/SolarRadiationChart';
import DashboardLayout from '../components/layout/DashboardLayout';

const DashboardPage = () => {
  const [sensorData, setSensorData] = useState({});
  const [historicalData, setHistoricalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Obtener datos actuales
      const currentData = await getDataParcelas();
      setSensorData(currentData);
      
      // Obtener datos históricos
      const [tempHistory, humidityHistory, rainHistory, radiationHistory] = await Promise.all([
        sensorService.getDatosHistoricos('temperatura', 24),
        sensorService.getDatosHistoricos('humedad', 24),
        sensorService.getDatosHistoricos('lluvia', 24),
        sensorService.getDatosHistoricos('radiacion', 24)
      ]);
      
      setHistoricalData({
        temperatura: tempHistory.data || [],
        humedad: humidityHistory.data || [],
        lluvia: rainHistory.data || [],
        radiacion_solar: radiationHistory.data || []
      });
      
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar los datos de sensores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    
    // Actualizar datos cada 60 segundos
    const interval = setInterval(fetchAllData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-lg text-gray-600">Cargando datos de sensores en tiempo real...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <p className="text-2xl text-red-500 font-semibold mb-2">⚠️ Error al cargar datos</p>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchAllData}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Reintentar
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Dashboard en Tiempo Real"
      subtitle="Monitoreo de sensores y condiciones agrícolas actuales"
    >
      {/* Tarjetas de métricas en tiempo real */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Temperatura Actual"
          value={sensorData.temperatura?.[0]?.value}
          unit="°C"
          icon="🌡️"
          color="blue"
          timestamp={sensorData.temperatura?.[0]?.timestamp}
        />
        
        <MetricCard
          title="Humedad Actual"
          value={sensorData.humedad?.[0]?.value}
          unit="%"
          icon="💧"
          color="green"
          condition={sensorData.humedad?.[0]?.value > 70 ? 'Alta' : 
                    sensorData.humedad?.[0]?.value > 40 ? 'Normal' : 'Baja'}
        />
        
        <MetricCard
          title="Precipitación"
          value={sensorData.lluvia?.[0]?.value}
          unit="mm"
          icon="☔"
          color="purple"
          condition={sensorData.lluvia?.[0]?.value > 0 ? 'Lluvia detectada' : 'Sin precipitación'}
        />
        
        <MetricCard
          title="Radiación Solar"
          value={sensorData.radiacion_solar?.[0]?.value}
          unit="W/m²"
          icon="☀️"
          color="yellow"
          condition={sensorData.radiacion_solar?.[0]?.value > 500 ? 'Alta radiación' : 'Radiación normal'}
        />
      </div>

      {/* Grid de gráficos históricos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TemperatureChart data={historicalData.temperatura || []} />
        <HumidityChart data={historicalData.humedad || []} />
        <RainChart data={historicalData.lluvia || []} />
        <SolarRadiationChart data={historicalData.radiacion_solar || []} />
      </div>

      {/* Información del sistema */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">Estado del Sistema</h3>
            <p className="text-sm text-gray-600">
              Última actualización: {lastUpdate.toLocaleString('es-MX')}
            </p>
            <p className="text-sm text-gray-600">
              Datos en tiempo real • Actualización automática cada 60 segundos
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-green-600 font-medium">Sistema en línea</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Componente de tarjeta de métrica
const MetricCard = ({ title, value, unit, icon, color, timestamp, condition }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {value !== undefined ? `${value}${unit}` : 'N/A'}
          </p>
          {condition && (
            <p className="text-xs text-gray-400 mt-1">{condition}</p>
          )}
        </div>
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
      {timestamp && (
        <p className="text-xs text-gray-400 mt-3">
          {new Date(timestamp).toLocaleTimeString('es-MX')}
        </p>
      )}
    </div>
  );
};

export default DashboardPage;
