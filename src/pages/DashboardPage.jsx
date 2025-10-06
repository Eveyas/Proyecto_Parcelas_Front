import { useEffect, useState } from 'react';
import { getDataParcelas } from '../modules/getDataParcelas';
import TemperatureChart from '../components/charts/TemperatureChart';
import HumidityChart from '../components/charts/HumidityChart';
import RainChart from '../components/charts/RainChart';
import SolarRadiationChart from '../components/charts/SolarRadiationChart';
import DashboardLayout from '../components/layout/DashboardLayout';

const DashboardPage = () => {
  const [sensorData, setSensorData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDataParcelas();
        setSensorData(data);
        setLastUpdate(new Date());
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
    // Actualizar datos cada 30 segundos
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-lg text-gray-600">Cargando datos de sensores...</p>
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
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
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
      title="Gestión de Parcelas Agrícolas"
      subtitle="Administra y visualiza todas las parcelas del sistema"
    >
      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Temperatura Actual</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {sensorData.temperatura?.[0]?.value ?? 'N/A'}°C
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🌡️</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            {sensorData.temperatura?.[0]?.timestamp ? 
              `Actualizado: ${new Date(sensorData.temperatura[0].timestamp).toLocaleTimeString('es-MX')}` : 
              'Sin datos recientes'
            }
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Humedad Actual</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {sensorData.humedad?.[0]?.value ?? 'N/A'}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💧</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Condición: {sensorData.humedad?.[0]?.value > 70 ? 'Alta' : 
                      sensorData.humedad?.[0]?.value > 40 ? 'Normal' : 'Baja'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Precipitación</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {sensorData.lluvia?.[0]?.value ?? 'N/A'}mm
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">☔</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            {sensorData.lluvia?.[0]?.value > 0 ? 'Lluvia detectada' : 'Sin precipitación'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Radiación Solar</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {sensorData.radiacion_solar?.[0]?.value ?? 'N/A'}W/m²
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">☀️</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            {sensorData.radiacion_solar?.[0]?.value > 500 ? 'Alta radiación' : 'Radiación normal'}
          </p>
        </div>
      </div>

      {/* Grid de gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TemperatureChart data={sensorData.temperatura || []} />
        <HumidityChart data={sensorData.humedad || []} />
        <RainChart data={sensorData.lluvia || []} />
        <SolarRadiationChart data={sensorData.radiacion_solar || []} />
      </div>

      {/* Información del sistema */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">Estado del Sistema</h3>
            <p className="text-sm text-gray-600">
              Última actualización: {lastUpdate.toLocaleString('es-MX')}
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

export default DashboardPage;
