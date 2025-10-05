import { useEffect, useState } from "react";
import { getDataParcelas } from "../modules/getDataParcelas";

function ParcelasPage() {
  const [data, setData] = useState({});
  const [selected, setSelected] = useState("temperatura");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100; // <- 100 registros por página

  useEffect(() => {
    getDataParcelas()
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Selección y eliminación de duplicados
  const dataset = (data[selected] || []).filter(
    (v, i, a) => i === a.findIndex((t) => t.timestamp === v.timestamp && t.value === v.value)
  );

  // Cálculo de datos de la página actual
  const totalPages = Math.ceil(dataset.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = dataset.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-lg text-gray-600">Cargando datos de sensores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-2xl text-red-500 font-semibold mb-2">Error al cargar datos</p>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* ENCABEZADO */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 shadow-lg">
        <h1 className="text-3xl font-bold text-center tracking-wide">
          Panel de Sensores Ambientales
        </h1>
        <p className="text-center text-blue-100 mt-2 text-sm">
          Datos en tiempo real de temperatura, humedad, lluvia y radiación solar
        </p>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="p-6 max-w-6xl mx-auto">
        {/* SELECTOR DE SENSOR */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-md border border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Selecciona tipo de sensor</h2>
            <p className="text-sm text-gray-500">
              Filtra los datos según el tipo de medición disponible
            </p>
          </div>

          <select
            className="border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none hover:border-blue-400 transition"
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value);
              setCurrentPage(1); // Reinicia paginación al cambiar de sensor
            }}
          >
            <option value="temperatura">🌡️ Temperatura</option>
            <option value="humedad">💧 Humedad</option>
            <option value="lluvia">☔ Lluvia</option>
            <option value="radiacion_solar">☀️ Radiación Solar</option>
          </select>
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Valor</th>
                <th className="p-3 text-left">Unidad</th>
                <th className="p-3 text-left">Fecha y hora</th>
                <th className="p-3 text-left">Latitud</th>
                <th className="p-3 text-left">Longitud</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr
                  key={startIndex + index}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition`}
                >
                  <td className="p-3 border-b border-gray-100">{startIndex + index + 1}</td>
                  <td className="p-3 border-b border-gray-100 font-semibold text-gray-800">
                    {item.value ?? "—"}
                  </td>
                  <td className="p-3 border-b border-gray-100">{item.unit ?? "—"}</td>
                  <td className="p-3 border-b border-gray-100">
                    {item.timestamp ? new Date(item.timestamp).toLocaleString("es-MX") : "—"}
                  </td>
                  <td className="p-3 border-b border-gray-100">{item.coords?.lat ?? "—"}</td>
                  <td className="p-3 border-b border-gray-100">{item.coords?.lon ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SELECT PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <select
              className="border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none hover:border-blue-400 transition"
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i} value={i + 1}>
                  Página {i + 1} ({i * itemsPerPage + 1} -{" "}
                  {Math.min((i + 1) * itemsPerPage, dataset.length)})
                </option>
              ))}
            </select>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-4 text-center">
          Mostrando {currentData.length} de {dataset.length} registros
        </p>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 text-sm py-6">
        © {new Date().getFullYear()} Sistema de Monitoreo Ambiental — Datos obtenidos de API.
      </footer>
    </div>
  );
}

export default ParcelasPage;
