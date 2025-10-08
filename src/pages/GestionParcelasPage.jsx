import { useState, useEffect } from 'react';
import ParcelasMap from '../components/maps/ParcelasMap';
import DashboardLayout from '../components/layout/DashboardLayout';
import ParcelasEliminadasList from '../components/CRUD/ParcelasEliminadasList';
import { parcelasService } from '../modules/apiService';

const GestionParcelasPage = () => {
  const [parcelasVigentes, setParcelasVigentes] = useState([]);
  const [parcelasEliminadas, setParcelasEliminadas] = useState([]);
  const [activeTab, setActiveTab] = useState('vigentes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchParcelasData = async () => {
    try {
      setLoading(true);
      const [vigentesResponse, eliminadasResponse] = await Promise.all([
        parcelasService.getParcelasVigentes(),
        parcelasService.getParcelasEliminadas()
      ]);

      if (vigentesResponse.success) {
        setParcelasVigentes(vigentesResponse.data || []);
      }

      if (eliminadasResponse.success) {
        // Transformar datos al formato
        const parcelasEliminadasFormateadas = (eliminadasResponse.data || []).map(parcela => ({
          id: parcela.id_parcela,
          nombre: parcela.nombre_parcela,
          cultivo: parcela.cultivo,
          responsable: parcela.responsable_nombre || 'No asignado',
          area: parcela.area_hectareas,
          ubicacion: parcela.ubicacion ? parseUbicacion(parcela.ubicacion) : null,
          fechaEliminacion: parcela.fecha_eliminacion,
          razon: parcela.razon_eliminacion || 'No especificada'
        }));
        setParcelasEliminadas(parcelasEliminadasFormateadas);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching parcelas:', err);
      setError('Error al cargar los datos de parcelas');
    } finally {
      setLoading(false);
    }
  };

  // Función para parsear ubicación de string a objeto
  const parseUbicacion = (ubicacionStr) => {
    if (!ubicacionStr) return null;
    
    try {
      const match = ubicacionStr.match(/Lat:\s*([\d.-]+),\s*Lon:\s*([\d.-]+)/);
      if (match) {
        return {
          lat: parseFloat(match[1]),
          lon: parseFloat(match[2])
        };
      }
      
      const coords = ubicacionStr.split(',').map(coord => parseFloat(coord.trim()));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        return { lat: coords[0], lon: coords[1] };
      }
    } catch (error) {
      console.warn('Error parsing ubicacion:', error);
    }
    
    return null;
  };

  useEffect(() => {
    fetchParcelasData();
  }, []);
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mb-4"></div>
          <p className="text-lg text-gray-600">Cargando datos de parcelas...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Gestión de Parcelas Agrícolas"
      subtitle="Visualiza y administra las parcelas en tiempo real"
      bgGradient="from-green-50 via-white to-blue-50"
      headerGradient="from-green-600 to-blue-600"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={fetchParcelasData}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Pestañas de navegación */}
      <div className="mb-6 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-4 px-6 text-center font-medium transition ${
              activeTab === 'vigentes' 
                ? 'bg-green-500 text-white' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('vigentes')}
          >
            🗺️ Mapa de Parcelas Vigentes ({parcelasVigentes.length})
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-medium transition ${
              activeTab === 'eliminadas' 
                ? 'bg-red-500 text-white' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('eliminadas')}
          >
            📋 Parcelas Eliminadas ({parcelasEliminadas.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'vigentes' ? (
            <ParcelasMap parcelas={parcelasVigentes} />
          ) : (
            <ParcelasEliminadasList parcelasEliminadas={parcelasEliminadas} />
          )}
        </div>
      </div>

      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Parcelas Vigentes</p>
          <p className="text-2xl font-bold text-gray-800">{parcelasVigentes.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-red-500">
          <p className="text-gray-500 text-sm">Parcelas Eliminadas</p>
          <p className="text-2xl font-bold text-gray-800">{parcelasEliminadas.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total de Parcelas</p>
          <p className="text-2xl font-bold text-gray-800">
            {parcelasVigentes.length + parcelasEliminadas.length}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GestionParcelasPage;