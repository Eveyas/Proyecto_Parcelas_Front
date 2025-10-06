import { useState, useEffect } from 'react';
import ParcelasMap from '../components/maps/ParcelasMap';
import DashboardLayout from '../components/layout/DashboardLayout';
import ParcelasEliminadasList from '../components/CRUD/ParcelasEliminadasList';

// Datos de ejemplo
const datosEjemploParcelas = [
  {
    id: 1,
    nombre: "Parcela Norte",
    cultivo: "Maíz",
    responsable: "Juan Pérez",
    area: 5.2,
    coords: { lat: 19.4326, lon: -99.1332 },
    estado: "vigente"
  },
  {
    id: 2,
    nombre: "Parcela Sur",
    cultivo: "Frijol",
    responsable: "María García",
    area: 3.8,
    coords: { lat: 19.4285, lon: -99.1276 },
    estado: "vigente"
  }
];

const datosEjemploEliminadas = [
  {
    id: 101,
    nombre: "Parcela Este Antigua",
    cultivo: "Trigo",
    responsable: "Carlos López",
    area: 4.5,
    ubicacion: { lat: 19.4350, lon: -99.1200 },
    fechaEliminacion: "2024-01-15",
    razon: "Cosecha completada"
  },
  {
    id: 102,
    nombre: "Parcela Oeste",
    cultivo: "Sorgo",
    responsable: "Ana Martínez",
    area: 6.2,
    ubicacion: { lat: 19.4300, lon: -99.1400 },
    fechaEliminacion: "2024-02-20",
    razon: "Rotación de cultivos"
  }
];

const GestionParcelasPage = () => {
  const [parcelasVigentes, setParcelasVigentes] = useState([]);
  const [parcelasEliminadas, setParcelasEliminadas] = useState([]);
  const [activeTab, setActiveTab] = useState('vigentes');

  useEffect(() => {
    // Simular carga de datos
    setParcelasVigentes(datosEjemploParcelas);
    setParcelasEliminadas(datosEjemploEliminadas);
  }, []);

  return (
    <DashboardLayout
      title="Gestión de Parcelas Agrícolas"
      subtitle="Visualiza y administra los datos en tiempo real"
      bgGradient="from-green-50 via-white to-blue-50"
      headerGradient="from-green-600 to-blue-600"
    >
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