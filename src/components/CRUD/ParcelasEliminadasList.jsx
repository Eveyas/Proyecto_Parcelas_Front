import { useState } from 'react';

const ParcelasEliminadasList = ({ parcelasEliminadas = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Cálculo de datos
  const totalPages = Math.ceil(parcelasEliminadas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = parcelasEliminadas.slice(startIndex, startIndex + itemsPerPage);

  if (parcelasEliminadas.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="text-4xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay parcelas eliminadas</h3>
        <p className="text-gray-600">No se han encontrado parcelas eliminadas en el sistema.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
        <h2 className="text-xl font-semibold text-gray-800">🗑️ Parcelas Eliminadas</h2>
        <p className="text-sm text-gray-600">
          {parcelasEliminadas.length} parcelas eliminadas del sistema
        </p>
      </div>

      {/* Tabla de parcelas eliminadas */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Cultivo</th>
              <th className="p-3 text-left">Responsable</th>
              <th className="p-3 text-left">Área</th>
              <th className="p-3 text-left">Ubicación</th>
              <th className="p-3 text-left">Fecha Eliminación</th>
              <th className="p-3 text-left">Razón</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((parcela, index) => (
              <tr
                key={parcela.id || index}
                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-red-50 transition`}
              >
                <td className="p-3 border-b border-gray-100 font-semibold text-gray-800">
                  {parcela.nombre}
                </td>
                <td className="p-3 border-b border-gray-100">{parcela.cultivo}</td>
                <td className="p-3 border-b border-gray-100">{parcela.responsable}</td>
                <td className="p-3 border-b border-gray-100">{parcela.area} ha</td>
                <td className="p-3 border-b border-gray-100">
                  {parcela.ubicacion ? `${parcela.ubicacion.lat?.toFixed(4)}, ${parcela.ubicacion.lon?.toFixed(4)}` : 'N/A'}
                </td>
                <td className="p-3 border-b border-gray-100">
                  {parcela.fechaEliminacion ? new Date(parcela.fechaEliminacion).toLocaleDateString('es-MX') : 'N/A'}
                </td>
                <td className="p-3 border-b border-gray-100">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    parcela.razon === 'Cosecha completada' ? 'bg-green-100 text-green-800' :
                    parcela.razon === 'Rotación de cultivos' ? 'bg-blue-100 text-blue-800' :
                    parcela.razon === 'Problemas de suelo' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {parcela.razon || 'No especificada'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, parcelasEliminadas.length)} de {parcelasEliminadas.length}
          </span>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Página {i + 1}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParcelasEliminadasList;
