const API_BASE = 'https://sensores-async-api.onrender.com';

// Función para obtener el token del localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Peticiones
const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Servicio de autenticación
export const authService = {
  async login(correo, contraseña) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ correo, contraseña })
    });
    
    if (!response.ok) {
      throw new Error('Error en autenticación');
    }
    
    return await response.json();
  },

  async register(usuarioData) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(usuarioData)
    });
    
    if (!response.ok) {
      throw new Error('Error en registro');
    }
    
    return await response.json();
  }
};

// Servicio de datos de sensores
export const sensorService = {
  async getDatosActuales() {
    const response = await fetch(`${API_BASE}/api/sensores/actual`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error obteniendo datos actuales');
    }
    
    return await response.json();
  },

  async getDatosHistoricos(tipo, horas = 24) {
    const params = new URLSearchParams();
    if (tipo) params.append('tipo', tipo);
    params.append('horas', horas.toString());

    const response = await fetch(`${API_BASE}/api/sensores/historico?${params}`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error obteniendo datos históricos');
    }
    
    return await response.json();
  },

  async getAllSensorsData() {
    const response = await fetch(`${API_BASE}/api/sensors/all`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error obteniendo datos de sensores');
    }
    
    return await response.json();
  }
};

// Servicio de parcelas
export const parcelasService = {
  async getParcelasVigentes() {
    const response = await fetch(`${API_BASE}/api/parcelas/vigentes`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error obteniendo parcelas vigentes');
    }
    
    const result = await response.json();
    if (result.success && result.data) {
      const parcelasTransformadas = result.data.map(parcela => ({
        id: parcela.id_parcela,
        nombre: parcela.nombre_parcela,
        cultivo: parcela.cultivo,
        responsable: parcela.responsable_nombre || 'No asignado',
        area: parcela.area_hectareas,
        estado: parcela.estado,
        coords: parsearUbicacion(parcela.ubicacion)
      }));
      
      return {
        success: true,
        data: parcelasTransformadas,
        distribucionCultivos: result.distribucionCultivos
      };
    }
    
    return result;
  },

  async getParcelasEliminadas() {
    const response = await fetch(`${API_BASE}/api/parcelas/eliminadas`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error obteniendo parcelas eliminadas');
    }
    
    const result = await response.json();
    if (result.success && result.data) {
      const eliminadasTransformadas = result.data.map(parcela => ({
        id: parcela.id_parcela_ref || parcela.id_eliminacion,
        nombre: parcela.nombre_parcela,
        cultivo: parcela.cultivo,
        responsable: parcela.responsable,
        area: parcela.area_hectareas || 'N/A',
        ubicacion: parsearUbicacion(parcela.ubicacion),
        fechaEliminacion: parcela.fecha_eliminacion,
        razon: parcela.razon_eliminacion || 'No especificada'
      }));
      
      return {
        success: true,
        data: eliminadasTransformadas,
        count: result.count
      };
    }
    
    return result;
  }
};

function parsearUbicacion(ubicacionStr) {
  if (!ubicacionStr) return { lat: 19.4326, lon: -99.1332 };
  
  console.log('Parseando ubicación:', ubicacionStr);
  
  // En formato: "Lat: 19.4326, Lon: -99.1332"
  const formatoLatLon = /Lat:\s*([\d.-]+),\s*Lon:\s*([\d.-]+)/i;
  const match = ubicacionStr.match(formatoLatLon);
  
  if (match) {
    return {
      lat: parseFloat(match[1]),
      lon: parseFloat(match[2])
    };
  }
  
  const formatosAlternativos = [
    /([\d.-]+)[,\s]+([\d.-]+)/,
    /lat[=:]?\s*([\d.-]+)[,\s]+lon[=:]?\s*([\d.-]+)/i
  ];
  
  for (const formato of formatosAlternativos) {
    const matchAlt = ubicacionStr.match(formato);
    if (matchAlt) {
      return {
        lat: parseFloat(matchAlt[1]),
        lon: parseFloat(matchAlt[2])
      };
    }
  }
  
  console.warn('No se pudo parsear ubicación, usando default:', ubicacionStr);
  return { lat: 19.4326, lon: -99.1332 }; // Default CDMX
}