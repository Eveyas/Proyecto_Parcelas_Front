import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.divIcon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const ParcelasMap = ({ parcelas = [] }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [selectedParcela, setSelectedParcela] = useState(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      // Inicializar el mapa
      mapInstance.current = L.map(mapRef.current).setView([19.4326, -99.1332], 10); // Centro en Ciudad de México

      // Añadir OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(mapInstance.current);

      // Configurar eventos del mapa
      mapInstance.current.on('click', function(e) {
        console.log('Coordenadas click:', e.latlng);
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || parcelas.length === 0) return;

    // Limpiar marcadores existentes
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstance.current.removeLayer(layer);
      }
    });

    // Añadir nuevos marcadores
    parcelas.forEach(parcela => {
      if (parcela.coords?.lat && parcela.coords?.lon) {
        const marker = L.marker([parcela.coords.lat, parcela.coords.lon])
          .addTo(mapInstance.current)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-bold text-lg">${parcela.nombre || 'Parcela'}</h3>
              <p><strong>Cultivo:</strong> ${parcela.cultivo || 'No especificado'}</p>
              <p><strong>Responsable:</strong> ${parcela.responsable || 'No asignado'}</p>
              <p><strong>Área:</strong> ${parcela.area || 'N/A'} ha</p>
              <p><strong>Estado:</strong> <span class="text-green-600 font-semibold">Vigente</span></p>
            </div>
          `);

        marker.on('click', () => {
          setSelectedParcela(parcela);
        });
      }
    });

    // Mostrar todos los marcadores
    if (parcelas.length > 0) {
      const group = new L.featureGroup(parcelas.map(p => 
        p.coords?.lat && p.coords?.lon ? 
        L.marker([p.coords.lat, p.coords.lon]) : null
      ).filter(Boolean));
      
      if (group.getLayers().length > 0) {
        mapInstance.current.fitBounds(group.getBounds().pad(0.1));
      }
    }
  }, [parcelas]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">🗺️ Mapa de Parcelas Vigentes</h2>
        <p className="text-sm text-gray-600">
          {parcelas.length} parcelas activas en el sistema
        </p>
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-96"
      />
      
      {selectedParcela && (
        <div className="p-4 border-t border-gray-200 bg-blue-50">
          <h3 className="font-semibold text-gray-800">Parcela Seleccionada</h3>
          <div className="grid grid-cols-2 gap-2 text-sm mt-2">
            <div><strong>Nombre:</strong> {selectedParcela.nombre}</div>
            <div><strong>Cultivo:</strong> {selectedParcela.cultivo}</div>
            <div><strong>Responsable:</strong> {selectedParcela.responsable}</div>
            <div><strong>Área:</strong> {selectedParcela.area} ha</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParcelasMap;
